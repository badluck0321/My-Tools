package com.example.BackEnd_MyTools.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;

import com.example.BackEnd_MyTools.DTO.AddToCartRequest;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import com.example.BackEnd_MyTools.Repositories.CartRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepo cartRepository;
    private final ProductRepo productRepository;
    private final KafkaProducerService kafka;

    public Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserIdAndStatus(userId, Cart.CartStatus.ACTIVE)
            .orElseGet(() -> {
                Cart cart = new Cart();
                cart.setUserId(userId);
                cart.setStatus(Cart.CartStatus.ACTIVE);
                cart.setItems(new ArrayList<>());
                cart.setCreatedAt(LocalDateTime.now());
                cart.setUpdatedAt(LocalDateTime.now());
                cart.setExpiresAt(LocalDateTime.now().plusDays(7));
                return cartRepository.save(cart);
            });
    }

    public Cart addItem(String userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!product.isIsavailable()) throw new IllegalArgumentException("Product is not available");
        if (request.getQuantity() <= 0) request.setQuantity(1);
        if (request.getListingType() == null) request.setListingType(Cart.CartItem.ListingType.SALE);
        validateRentalDatesIfNeeded(request);

        Cart cart = getOrCreateCart(userId);
        boolean exists = cart.getItems().stream()
            .filter(i -> i.getProductId().equals(request.getProductId()) && sameRentalWindow(i, request))
            .findFirst()
            .map(i -> { i.setQuantity(i.getQuantity() + request.getQuantity()); return true; })
            .orElse(false);

        if (!exists) {
            Cart.CartItem item = Cart.CartItem.builder()
                .productId(product.getId())
                .productName(product.getName())
                .price(product.getPrice())
                .quantity(request.getQuantity())
                .listingType(request.getListingType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .addedAt(LocalDateTime.now())
                .build();
            cart.getItems().add(item);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plusDays(7));
        try {
            kafka.sendActivity(userId, "ADDED_TO_CART", request.getProductId(), "PRODUCT");
            kafka.sendAnalytics("CART_ADD", userId, Map.of("productId", request.getProductId(), "listingType", request.getListingType()));
        } catch (Exception ignored) {}
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String userId, String productId, int quantity) {
        if (quantity <= 0) return removeItem(userId, productId);
        Cart cart = getOrCreateCart(userId);
        Cart.CartItem item = cart.getItems().stream()
            .filter(i -> i.getProductId().equals(productId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        item.setQuantity(quantity);
        cart.setUpdatedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plusDays(7));
        return cartRepository.save(cart);
    }

    public Cart removeItem(String userId, String productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        cartRepository.findByUserIdAndStatus(userId, Cart.CartStatus.ACTIVE)
            .ifPresent(cart -> {
                cart.getItems().clear();
                cart.setUpdatedAt(LocalDateTime.now());
                cartRepository.save(cart);
            });
    }

    public void checkoutCart(String userId) {
        cartRepository.findByUserIdAndStatus(userId, Cart.CartStatus.ACTIVE)
            .ifPresent(cart -> {
                cart.setStatus(Cart.CartStatus.CHECKED_OUT);
                cart.setUpdatedAt(LocalDateTime.now());
                cartRepository.save(cart);
            });
    }

    private void validateRentalDatesIfNeeded(AddToCartRequest request) {
        if (request.getListingType() == Cart.CartItem.ListingType.RENT) {
            if (request.getStartDate() == null || request.getEndDate() == null) throw new IllegalArgumentException("Rental requires start and end dates");
            if (request.getStartDate().isBefore(LocalDate.now())) throw new IllegalArgumentException("Start date cannot be in the past");
            if (!request.getEndDate().isAfter(request.getStartDate())) throw new IllegalArgumentException("End date must be after start date");
        }
    }

    private boolean sameRentalWindow(Cart.CartItem item, AddToCartRequest request) {
        return item.getListingType() == request.getListingType()
            && java.util.Objects.equals(item.getStartDate(), request.getStartDate())
            && java.util.Objects.equals(item.getEndDate(), request.getEndDate());
    }
}

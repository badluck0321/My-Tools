package com.example.BackEnd_MyTools.Services;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import org.springframework.stereotype.Service;
import com.example.BackEnd_MyTools.DTO.AddToCartRequest;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.CartRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepo cartRepository;
    private final ProductRepo productRepository;
    private final KafkaProducerService kafka;

    /* ── Get or create cart for user ── */
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

    /* ── Add item with validation ── */
    public Cart addItem(String userId, AddToCartRequest request) {

        // 1. fetch product and validate it exists
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. validate availability
        if (!product.isIsavailable()) {
            throw new RuntimeException("Product is not available");
        }

        // 3. validate rental dates if listing type is RENT
        if (request.getListingType() == Cart.CartItem.ListingType.RENT) {
            if (request.getStartDate() == null || request.getEndDate() == null) {
                throw new RuntimeException("Rental requires start and end dates");
            }
            if (request.getStartDate().isBefore(LocalDate.now())) {
                throw new RuntimeException("Start date cannot be in the past");
            }
            if (!request.getEndDate().isAfter(request.getStartDate())) {
                throw new RuntimeException("End date must be after start date");
            }
        }

        Cart cart = getOrCreateCart(userId);

        // 4. prevent duplicate — update qty if already in cart
        boolean exists = cart.getItems().stream()
            .filter(i -> i.getProductId().equals(request.getProductId()))
            .findFirst()
            .map(i -> { i.setQuantity(i.getQuantity() + 1); return true; })
            .orElse(false);

        // 5. add new item with price snapshot
        if (!exists) {
            Cart.CartItem item = Cart.CartItem.builder()
                .productId(product.getId())
                .productName(product.getName())   // snapshot
                .price(product.getPrice()) // snapshot
                .quantity(1)
                .listingType(request.getListingType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .addedAt(LocalDateTime.now())
                .build();
            cart.getItems().add(item);
        }

        // 6. refresh expiry on every interaction
        cart.setUpdatedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plusDays(7));


        // emit activity
        kafka.sendActivity(userId, "ADDED_TO_CART", request.getProductId(), "PRODUCT");

        // emit analytics
        kafka.sendAnalytics("CART_ADD", userId, Map.of(
            "productId", request.getProductId(),
            "listingType", request.getListingType()
        ));
        return cartRepository.save(cart);
    }

    /* ── Remove item ── */
    public Cart removeItem(String userId, String productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    /* ── Clear cart ── */
    public void clearCart(String userId) {
        cartRepository.findByUserIdAndStatus(userId, Cart.CartStatus.ACTIVE)
            .ifPresent(cart -> {
                cart.getItems().clear();
                cart.setUpdatedAt(LocalDateTime.now());
                cartRepository.save(cart);
            });
    }

    /* ── Mark as checked out (called from Order service) ── */
    public void checkoutCart(String userId) {
        cartRepository.findByUserIdAndStatus(userId, Cart.CartStatus.ACTIVE)
            .ifPresent(cart -> {
                cart.setStatus(Cart.CartStatus.CHECKED_OUT);
                cart.setUpdatedAt(LocalDateTime.now());
                cartRepository.save(cart);
            });
    }
}
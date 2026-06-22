package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.CheckoutRequest;
import com.example.BackEnd_MyTools.Entitys.Booking;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Entitys.Order;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Kafka.Events.OrderEvent;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import com.example.BackEnd_MyTools.Repositories.CartRepo;
import com.example.BackEnd_MyTools.Repositories.OrderRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepo orderRepo;
    private final CartRepo cartRepo;
    private final ProductRepo productRepo;
    private final CartService cartService;
    private final BookingService bookingService;
    private final NotificationService notificationService;
    private final KafkaProducerService kafkaProducerService;

    public Order checkout(Jwt jwt, CheckoutRequest request) {
        String buyerId = SecurityUtils.currentUserId(jwt);
        Cart cart = cartRepo.findByUserIdAndStatus(buyerId, Cart.CartStatus.ACTIVE)
            .orElseThrow(() -> new IllegalArgumentException("Active cart not found"));
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Order order = new Order();
        order.setBuyerId(buyerId);
        order.setBuyerUsername(SecurityUtils.currentUsername(jwt));
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus(Order.PaymentStatus.UNPAID);
        order.setShippingAddress(request != null ? request.getShippingAddress() : null);
        order.setNote(request != null ? request.getNote() : null);
        order.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        double total = 0;
        for (Cart.CartItem cartItem : cart.getItems()) {
            Product product = productRepo.findById(cartItem.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + cartItem.getProductId()));
            if (!product.isIsavailable()) {
                throw new IllegalArgumentException("Product is not available: " + product.getName());
            }

            long rentalDays = 0;
            double lineTotal;
            if (cartItem.getListingType() == Cart.CartItem.ListingType.RENT) {
                if (cartItem.getStartDate() == null || cartItem.getEndDate() == null) {
                    throw new IllegalArgumentException("Rental dates are required for " + product.getName());
                }
                rentalDays = Math.max(1, ChronoUnit.DAYS.between(cartItem.getStartDate(), cartItem.getEndDate()));
                if (bookingService.hasConflict(product.getId(), cartItem.getStartDate(), cartItem.getEndDate())) {
                    throw new IllegalArgumentException("Product is already booked for selected dates: " + product.getName());
                }
                lineTotal = product.getPrice() * rentalDays * Math.max(1, cartItem.getQuantity());
            } else {
                lineTotal = product.getPrice() * Math.max(1, cartItem.getQuantity());
            }

            total += lineTotal;
            order.getItems().add(Order.OrderItem.builder()
                .productId(product.getId())
                .productName(product.getName())
                .ownerId(product.getOwnerId())
                .price(product.getPrice())
                .quantity(Math.max(1, cartItem.getQuantity()))
                .listingType(cartItem.getListingType())
                .startDate(cartItem.getStartDate())
                .endDate(cartItem.getEndDate())
                .rentalDays(rentalDays)
                .lineTotal(lineTotal)
                .build());
        }

        order.setTotalAmount(total);
        Order saved = orderRepo.save(order);

        for (Cart.CartItem cartItem : cart.getItems()) {
            if (cartItem.getListingType() == Cart.CartItem.ListingType.RENT) {
                Product product = productRepo.findById(cartItem.getProductId()).orElseThrow();
                bookingService.createFromOrderItem(product, buyerId, saved.getId(), cartItem, Booking.BookingStatus.PENDING);
            }
        }

        cartService.checkoutCart(buyerId);
        notificationService.create(buyerId, "ORDER_CREATED", "Order placed", "Your order " + saved.getInvoiceNumber() + " has been created.", saved.getId());
        saved.getItems().stream()
            .map(Order.OrderItem::getOwnerId)
            .filter(owner -> owner != null && !owner.equals(buyerId))
            .distinct()
            .forEach(owner -> notificationService.create(owner, "NEW_ORDER", "New order", "A customer placed an order containing your listing.", saved.getId()));
        try {
            kafkaProducerService.sendOrderEvent(OrderEvent.builder()
                .orderId(saved.getId())
                .userId(buyerId)
                .status(saved.getStatus().name())
                .occurredAt(LocalDateTime.now())
                .build());
        } catch (Exception ignored) {}
        return saved;
    }

    public List<Order> myOrders(String buyerId) {
        return orderRepo.findByBuyerIdOrderByCreatedAtDesc(buyerId);
    }

    public List<Order> sellerOrders(String ownerId) {
        return orderRepo.findSellerOrders(ownerId);
    }

    public List<Order> allOrders(Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt)) throw new SecurityException("Admin role required");
        return orderRepo.findAll();
    }

    public Order updateStatus(String orderId, Order.OrderStatus status, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        boolean seller = order.getItems().stream().anyMatch(i -> userId.equals(i.getOwnerId()));
        boolean buyerCancel = userId.equals(order.getBuyerId()) && status == Order.OrderStatus.CANCELLED && order.getStatus() == Order.OrderStatus.PENDING;
        if (!SecurityUtils.isAdmin(jwt) && !seller && !buyerCancel) {
            throw new SecurityException("You are not allowed to update this order");
        }
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        if (status == Order.OrderStatus.DELIVERED) order.setDeliveredAt(LocalDateTime.now());
        Order saved = orderRepo.save(order);
        notificationService.create(order.getBuyerId(), "ORDER_STATUS", "Order updated", "Your order is now " + status.name().toLowerCase(), saved.getId());
        return saved;
    }

    public Order getAccessibleOrder(String orderId, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        boolean seller = order.getItems().stream().anyMatch(i -> userId.equals(i.getOwnerId()));
        if (!SecurityUtils.isAdmin(jwt) && !seller && !userId.equals(order.getBuyerId())) {
            throw new SecurityException("You cannot access this order");
        }
        return order;
    }
}

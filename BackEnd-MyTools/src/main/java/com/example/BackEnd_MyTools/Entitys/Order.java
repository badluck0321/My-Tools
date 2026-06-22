package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Order")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    private String id;

    private String buyerId;
    private String buyerUsername;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private List<OrderItem> items = new ArrayList<>();
    private double totalAmount;
    private String shippingAddress;
    private String note;
    private String invoiceNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveredAt;

    public enum OrderStatus { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }
    public enum PaymentStatus { UNPAID, AUTHORIZED, PAID, REFUNDED }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItem {
        private String productId;
        private String productName;
        private String ownerId;
        private double price;
        private int quantity;
        private Cart.CartItem.ListingType listingType;
        private LocalDate startDate;
        private LocalDate endDate;
        private long rentalDays;
        private double lineTotal;
    }
}

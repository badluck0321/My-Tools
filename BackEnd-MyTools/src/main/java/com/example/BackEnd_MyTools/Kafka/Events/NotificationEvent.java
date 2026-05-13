package com.example.BackEnd_MyTools.Kafka.Events;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationEvent {
    private String id;
    private String userId;        // recipient
    private String type;          // ORDER_PLACED, CART_UPDATED, PRODUCT_LIKED...
    private String title;
    private String message;
    private String referenceId;   // productId, orderId, etc.
    private LocalDateTime createdAt;
}

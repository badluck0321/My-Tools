package com.example.BackEnd_MyTools.Kafka.Events;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Data
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class AnalyticsEvent {
    private String userId;
    private String action;        // PRODUCT_VIEWED, ADDED_TO_CART, FAVORITED, SEARCHED
    private String resourceId;    // productId, storeId...
    private String resourceType; // PRODUCT, STORE, MASTERY
        private String eventType; // PRODUCT, STORE, MASTERY
    private LocalDateTime occurredAt;
}

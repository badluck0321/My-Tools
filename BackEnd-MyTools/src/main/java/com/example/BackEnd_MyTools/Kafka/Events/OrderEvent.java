package com.example.BackEnd_MyTools.Kafka.Events;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {
    private String orderId;
    private String userId;
    private String status;        // PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    private List<String> productIds;
    private double totalAmount;
    private LocalDateTime occurredAt;
}

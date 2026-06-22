package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    private String id;
    private String orderId;
    private String userId;
    private String provider;
    private String providerSessionId;
    private PaymentStatus status;
    private double amount;
    private String currency;
    private String checkoutUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum PaymentStatus { PENDING, AUTHORIZED, PAID, FAILED, REFUNDED }
}

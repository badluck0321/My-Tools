package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    private String id;
    private String productId;
    private String productName;
    private String ownerId;
    private String userId;
    private String orderId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int quantity;
    private double dailyPrice;
    private long durationDays;
    private double totalPrice;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum BookingStatus { PENDING, CONFIRMED, CANCELLED, COMPLETED }
}

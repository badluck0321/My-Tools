package com.example.BackEnd_MyTools.DTO;

import java.time.LocalDate;

import com.example.BackEnd_MyTools.Entitys.Booking;

import lombok.Data;

@Data
public class CreateBookingRequest {
    // New generic fields.
    private Booking.ResourceType resourceType = Booking.ResourceType.PRODUCT;
    private String resourceId;

    // Backward-compatible shortcuts.
    private String productId;
    private String masteryId;

    private LocalDate startDate;
    private LocalDate endDate;
    private int quantity = 1;
}

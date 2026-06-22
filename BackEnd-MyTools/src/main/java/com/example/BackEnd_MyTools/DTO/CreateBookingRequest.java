package com.example.BackEnd_MyTools.DTO;

import java.time.LocalDate;
import lombok.Data;

@Data
public class CreateBookingRequest {
    private String productId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int quantity = 1;
}

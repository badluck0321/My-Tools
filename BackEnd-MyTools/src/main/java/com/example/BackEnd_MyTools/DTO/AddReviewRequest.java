package com.example.BackEnd_MyTools.DTO;

import lombok.Data;

@Data
public class AddReviewRequest {
    private String productId;
    private String masteryId;
    private int rating;      // 1–5
    private String comment;
}
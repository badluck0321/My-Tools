package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Review")
@Data
public class Review {
    @Id
    private String id;

    private String productId;
    private String masteryId;
    private String userId;          // Keycloak sub
    private String username;        // snapshot
    private int rating;             // 1 to 5
    private String comment;
    private LocalDateTime createdAt;
    private boolean verifiedPurchase; // true if userId has bought/rented this product
}

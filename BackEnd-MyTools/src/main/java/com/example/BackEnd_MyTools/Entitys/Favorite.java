package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Favorite")
@Data
public class Favorite {

    @Id
    private String id;

    private String userId;        // Keycloak sub

    // Generic favorite target. Kept flexible so the wishlist can support products,
    // masteries, and future resources without another collection migration.
    private String targetType;    // PRODUCT, MASTERY
    private String targetId;

    // Legacy/product-compatible fields used by existing UI and seed data.
    private String productId;
    private String productName;

    // Mastery-compatible snapshot fields.
    private String masteryId;
    private String itemName;

    private double price;
    private String photoUrl;
    private LocalDateTime savedAt;
}

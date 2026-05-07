package com.example.BackEnd_MyTools.Entitys;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Cart")
@Data
public class Cart {

    @Id
    private String id;

    private String userId;           // Keycloak sub — immutable after creation
    private CartStatus status;       // ACTIVE, CHECKED_OUT, ABANDONED
    private List<CartItem> items = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime expiresAt; // auto-abandon after 7 days inactivity

    public enum CartStatus {
        ACTIVE, CHECKED_OUT, ABANDONED
    }

    @Data
    @Builder
    @NoArgsConstructor   // ← add
    @AllArgsConstructor  // ← add
    public static class CartItem {
        private String productId;
        private String productName;  // snapshot — in case product is deleted later
        private double price;        // snapshot — price at time of adding
        private int quantity;
        private ListingType listingType;

        // only for rentals
        private LocalDate startDate;
        private LocalDate endDate;

        private LocalDateTime addedAt;

        public enum ListingType { SALE, RENT }
    }
}
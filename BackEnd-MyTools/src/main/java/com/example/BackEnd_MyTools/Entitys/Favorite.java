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
    private String productId;     // reference to Product
    private String productName;   // snapshot
    private double price;         // snapshot
    private LocalDateTime savedAt;
}
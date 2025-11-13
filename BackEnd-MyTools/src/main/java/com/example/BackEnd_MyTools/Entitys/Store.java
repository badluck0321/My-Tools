package com.example.BackEnd_MyTools.Entitys;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Store")
@Data

public class Store {
    @Id
    String id;
    String name;
    String email;
    Boolean isActive = true;
    Boolean isVerified = false;
    Instant createdAt;
    List<String> ownerId;
    List<String> associatsId;

    List<String> socialMedias;

}

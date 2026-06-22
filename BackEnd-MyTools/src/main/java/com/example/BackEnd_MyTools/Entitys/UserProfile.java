package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "UserProfile")
@Data
public class UserProfile {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String city;
    private String address;
    private String bio;
    private String avatarPhotoId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

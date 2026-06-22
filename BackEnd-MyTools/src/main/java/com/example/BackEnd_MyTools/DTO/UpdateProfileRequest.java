package com.example.BackEnd_MyTools.DTO;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String city;
    private String address;
    private String bio;
    private String avatarPhotoId;
}

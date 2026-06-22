package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.UpdateProfileRequest;
import com.example.BackEnd_MyTools.Entitys.UserProfile;
import com.example.BackEnd_MyTools.Repositories.UserProfileRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepo userProfileRepo;

    public UserProfile getOrCreate(Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        return userProfileRepo.findByUserId(userId).orElseGet(() -> {
            UserProfile profile = new UserProfile();
            profile.setUserId(userId);
            profile.setUsername(SecurityUtils.currentUsername(jwt));
            profile.setEmail(jwt.getClaimAsString("email"));
            profile.setFirstName(jwt.getClaimAsString("given_name"));
            profile.setLastName(jwt.getClaimAsString("family_name"));
            profile.setCreatedAt(LocalDateTime.now());
            profile.setUpdatedAt(LocalDateTime.now());
            return userProfileRepo.save(profile);
        });
    }

    public UserProfile update(Jwt jwt, UpdateProfileRequest request) {
        UserProfile profile = getOrCreate(jwt);
        if (request.getUsername() != null) profile.setUsername(request.getUsername());
        if (request.getEmail() != null) profile.setEmail(request.getEmail());
        if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
        if (request.getLastName() != null) profile.setLastName(request.getLastName());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getAvatarPhotoId() != null) profile.setAvatarPhotoId(request.getAvatarPhotoId());
        profile.setUpdatedAt(LocalDateTime.now());
        return userProfileRepo.save(profile);
    }
}

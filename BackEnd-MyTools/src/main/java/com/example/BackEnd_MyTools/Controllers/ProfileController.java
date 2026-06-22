package com.example.BackEnd_MyTools.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.DTO.UpdateProfileRequest;
import com.example.BackEnd_MyTools.Entitys.UserProfile;
import com.example.BackEnd_MyTools.Services.UserProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(userProfileService.getOrCreate(jwt));
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UpdateProfileRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(userProfileService.update(jwt, request));
    }
}

package com.example.BackEnd_MyTools.Controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.BackEnd_MyTools.DTO.VendorVerificationRequest;
import com.example.BackEnd_MyTools.Entitys.VendorVerification;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.PhotoService;
import com.example.BackEnd_MyTools.Services.VendorVerificationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vendor-verifications")
@RequiredArgsConstructor
public class VendorVerificationController {
    private final VendorVerificationService vendorVerificationService;
    private final PhotoService photoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VendorVerification> submit(@RequestPart("verification") String verificationJson,
            @RequestPart("document") MultipartFile document,
            @AuthenticationPrincipal Jwt jwt) throws Exception {
        VendorVerificationRequest request = new ObjectMapper().readValue(verificationJson,
                VendorVerificationRequest.class);
        String photoUrls = photoService.savePhoto(document);
        return ResponseEntity.ok(vendorVerificationService.submit(jwt, request, photoUrls));
    }

    @GetMapping("/mine")
    public ResponseEntity<VendorVerification> mine(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(vendorVerificationService.mine(SecurityUtils.currentUserId(jwt)));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<VendorVerification>> pending(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(vendorVerificationService.pending(jwt));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<VendorVerification> review(@PathVariable String id,
            @RequestParam VendorVerification.VerificationStatus status,
            @RequestParam(required = false) String comment,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(vendorVerificationService.review(id, status, comment, jwt));
    }
}

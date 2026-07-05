package com.example.BackEnd_MyTools.Controllers;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.BackEnd_MyTools.DTO.DtoGetVendorVerification;
import com.example.BackEnd_MyTools.Entitys.VendorVerification;
import com.example.BackEnd_MyTools.Mapper.VendorVerificationMapper;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.PhotoService;
import com.example.BackEnd_MyTools.Services.VendorVerificationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vendor-verifications")
@RequiredArgsConstructor
public class VendorVerificationController {
    private final VendorVerificationService vendorVerificationService;
    private final PhotoService photoService;
    private final VendorVerificationMapper vendorVerificationMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VendorVerification> submit(@RequestPart("verification") String verificationJson,
            @RequestPart("document") MultipartFile document,
            @AuthenticationPrincipal Jwt jwt) throws Exception {
        DtoGetVendorVerification request = new ObjectMapper().readValue(verificationJson,
                DtoGetVendorVerification.class);
        String photoUrls = photoService.savePhoto(document);
        return ResponseEntity.ok(vendorVerificationService.submit(jwt, request, photoUrls));
    }

    @GetMapping("/mine")
    public ResponseEntity<DtoGetVendorVerification> mine(@AuthenticationPrincipal Jwt jwt, HttpServletRequest request) {
        VendorVerification vendorVerification = vendorVerificationService.mine(SecurityUtils.currentUserId(jwt));
        String baseUrl = String.format("%s://%s:%d%s", request.getScheme(), request.getServerName(),
                request.getServerPort(), request.getContextPath());
        return ResponseEntity.ok(vendorVerificationMapper.toDto(vendorVerification, baseUrl));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DtoGetVendorVerification>> pending(@AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request) {
        List<VendorVerification> vendorVerifications = vendorVerificationService
                .pending(jwt);

        String baseUrl = String.format("%s://%s:%d%s", request.getScheme(), request.getServerName(),
                request.getServerPort(), request.getContextPath());
        return ResponseEntity.ok(vendorVerificationMapper.toDtoList(vendorVerifications, baseUrl));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<VendorVerification> review(@PathVariable String id,
            @RequestParam VendorVerification.VerificationStatus status,
            @RequestParam(required = false) String comment,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(vendorVerificationService.review(id, status, comment, jwt));
    }

    @GetMapping("/photos/{photoUrls}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String photoUrls) throws IOException {
        return photoService.getPhoto(photoUrls)
                .map(photoData -> ResponseEntity.ok().contentType(MediaType.parseMediaType(photoData.contentType()))
                        .body(photoData.bytes()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

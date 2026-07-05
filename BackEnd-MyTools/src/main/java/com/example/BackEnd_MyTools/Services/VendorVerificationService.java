package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.DtoGetVendorVerification;
import com.example.BackEnd_MyTools.Entitys.VendorVerification;
import com.example.BackEnd_MyTools.Repositories.VendorVerificationRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendorVerificationService {
    private final VendorVerificationRepo vendorVerificationRepo;
    private final NotificationService notificationService;

    public VendorVerification submit(Jwt jwt, DtoGetVendorVerification request, String photoUrl) {
        String userId = SecurityUtils.currentUserId(jwt);
        VendorVerification verification = new VendorVerification();
        verification.setUserId(userId);
        verification.setLegalName(request.getLegalName());
        verification.setBusinessName(request.getBusinessName());
        verification.setDocumentType(request.getDocumentType());
        verification.setPhotoUrl(photoUrl);
        verification.setNote(request.getNote());
        verification.setStatus(VendorVerification.VerificationStatus.PENDING);
        verification.setCreatedAt(LocalDateTime.now());
        verification.setUpdatedAt(LocalDateTime.now());
        return vendorVerificationRepo.save(verification);
    }

    public VendorVerification mine(String userId) {
        return vendorVerificationRepo.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);
    }

    public List<VendorVerification> pending(Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt))
            throw new SecurityException("Admin role required");
        return vendorVerificationRepo.findByStatusOrderByCreatedAtDesc(VendorVerification.VerificationStatus.PENDING);
    }

    public VendorVerification review(String id, VendorVerification.VerificationStatus status, String comment, Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt))
            throw new SecurityException("Admin role required");
        VendorVerification verification = vendorVerificationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found"));
        verification.setStatus(status);
        verification.setReviewComment(comment);
        verification.setReviewedBy(SecurityUtils.currentUserId(jwt));
        verification.setUpdatedAt(LocalDateTime.now());
        VendorVerification saved = vendorVerificationRepo.save(verification);
        notificationService.create(saved.getUserId(), "VENDOR_VERIFICATION", "Vendor verification updated",
                "Your vendor verification is " + status.name().toLowerCase(), saved.getId());
        return saved;
    }
}

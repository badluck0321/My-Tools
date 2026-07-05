package com.example.BackEnd_MyTools.DTO;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data

public class DtoGetVendorVerification {
    @Id
    private String id;
    private String userId;
    private String legalName;
    private String businessName;
    private String documentType;
    private String photoUrl;
    private String note;
    private VerificationStatus status;
    private String reviewedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        PENDING, APPROVED, REJECTED
    }
}

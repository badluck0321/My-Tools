package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "VendorVerification")
@Data
public class VendorVerification {
    @Id
    private String id;
    private String userId;
    private String legalName;
    private String businessName;
    private String documentType;
    private String documentPhotoId;
    private String note;
    private VerificationStatus status;
    private String reviewedBy;
    private String reviewComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum VerificationStatus { PENDING, APPROVED, REJECTED }
}

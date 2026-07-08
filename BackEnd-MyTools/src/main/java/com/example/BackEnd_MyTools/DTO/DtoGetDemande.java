package com.example.BackEnd_MyTools.DTO;

import java.time.LocalDateTime;

import com.example.BackEnd_MyTools.Entitys.RoleRequest;

import lombok.Data;

@Data
public class DtoGetDemande {
    private String id;
    private String userId;
    private String username;
    private RoleRequest.RoleRequestType type;
    private String description;
    private RoleRequest.RoleRequestStatus status;
    private String reviewedBy;
    private String reviewComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

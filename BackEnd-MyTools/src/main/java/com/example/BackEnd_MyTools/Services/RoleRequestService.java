package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.DtoCreateDemande;
import com.example.BackEnd_MyTools.DTO.DtoGetDemande;
import com.example.BackEnd_MyTools.Entitys.RoleRequest;
import com.example.BackEnd_MyTools.Repositories.RoleRequestRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.KeycloakAdminService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleRequestService {
    private final RoleRequestRepo roleRequestRepo;
    private final NotificationService notificationService;
    private final KeycloakAdminService keycloakAdminService;

    /**
     * An authenticated user submits a request to become a Store Owner or Craftsman.
     */
    public RoleRequest submitRoleRequest(Jwt jwt, DtoCreateDemande request) {
        String userId = SecurityUtils.currentUserId(jwt);

        if (SecurityUtils.isAdmin(jwt) || SecurityUtils.isStoreOwner(jwt) || SecurityUtils.IsCraftMan(jwt)) {
            throw new IllegalStateException("You already have an authorized role.");
        }

        // Prevent duplicate open requests for the same role.
        Optional<RoleRequest> existing = roleRequestRepo
                .findTopByUserIdAndStatusOrderByCreatedAtDesc(userId, RoleRequest.RoleRequestStatus.PENDING);
        if (existing.isPresent() && existing.get().getType() == request.getType()) {
            throw new IllegalStateException("You already have a pending request for this role.");
        }
        RoleRequest roleRequest = new RoleRequest();
        roleRequest.setUserId(userId);
        roleRequest.setUsername(SecurityUtils.currentUsername(jwt));
        roleRequest.setType(request.getType());
        roleRequest.setDescription(request.getDescription());
        roleRequest.setStatus(RoleRequest.RoleRequestStatus.PENDING);
        roleRequest.setCreatedAt(LocalDateTime.now());
        roleRequest.setUpdatedAt(LocalDateTime.now());
        return roleRequestRepo.save(roleRequest);
    }

    public RoleRequest myRoleRequests(String userId) {
        return roleRequestRepo.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);
    }

    public List<RoleRequest> myRoleRequestsHistory(String userId) {
        return roleRequestRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<RoleRequest> pendingRoleRequest(Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt)) {
            throw new SecurityException("Admin role required");
        }
        return roleRequestRepo.findByStatusOrderByCreatedAtDesc(RoleRequest.RoleRequestStatus.PENDING);
    }

    public List<RoleRequest> allRoleRequests(Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt)) {
            throw new SecurityException("Admin role required");
        }
        return roleRequestRepo.findAll();
    }

    /**
     * Admin approves or rejects a request. On approval the Keycloak role is
     * assigned.
     */
    public RoleRequest reviewRoleRequest(String id, RoleRequest.RoleRequestStatus status, String comment, Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt)) {
            throw new SecurityException("Admin role required");
        }
        RoleRequest roleRequest = roleRequestRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role request not found"));
        if (roleRequest.getStatus() != RoleRequest.RoleRequestStatus.PENDING) {
            throw new IllegalStateException("This request has already been reviewed.");
        }
        roleRequest.setStatus(status);
        roleRequest.setReviewComment(comment);
        roleRequest.setReviewedBy(SecurityUtils.currentUserId(jwt));
        roleRequest.setUpdatedAt(LocalDateTime.now());
        RoleRequest saved = roleRequestRepo.save(roleRequest);

        if (status == RoleRequest.RoleRequestStatus.APPROVED) {
            String role = KeycloakAdminService.roleFor(roleRequest.getType());
            keycloakAdminService.assignRealmRole(roleRequest.getUserId(), role);
            notificationService.create(roleRequest.getUserId(), "ROLE_REQUEST_APPROVED",
                    "Role request approved",
                    "Congratulations! You are now a " + roleRequest.getType().name().replace("_", " ").toLowerCase()
                            + ". The " + role + " role has been assigned to your account.",
                    saved.getId());
        } else if (status == RoleRequest.RoleRequestStatus.REJECTED) {
            notificationService.create(roleRequest.getUserId(), "ROLE_REQUEST_REJECTED",
                    "Role request rejected",
                    "Your request to become a " + roleRequest.getType().name().replace("_", " ").toLowerCase()
                            + (comment != null && !comment.isBlank() ? " was rejected: " + comment : " was rejected."),
                    saved.getId());
        }
        return saved;
    }

    /**
     * User deletes their own pending request.
     */
    public void deleteRoleRequest(String id, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        RoleRequest roleRequest = roleRequestRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role request not found"));

        // Only the request owner can delete, or an admin
        if (!roleRequest.getUserId().equals(userId) && !SecurityUtils.isAdmin(jwt)) {
            throw new SecurityException("You can only delete your own requests");
        }

        // Only allow deletion if the request is still pending
        if (roleRequest.getStatus() != RoleRequest.RoleRequestStatus.PENDING) {
            throw new IllegalStateException("Only pending requests can be deleted");
        }

        roleRequestRepo.deleteById(id);
    }

    public DtoGetDemande toDto(RoleRequest roleRequest) {
        if (roleRequest == null) {
            return null;
        }
        DtoGetDemande dto = new DtoGetDemande();
        dto.setId(roleRequest.getId());
        dto.setUserId(roleRequest.getUserId());
        dto.setUsername(roleRequest.getUsername());
        dto.setType(roleRequest.getType());
        dto.setDescription(roleRequest.getDescription());
        dto.setStatus(roleRequest.getStatus());
        dto.setReviewedBy(roleRequest.getReviewedBy());
        dto.setReviewComment(roleRequest.getReviewComment());
        dto.setCreatedAt(roleRequest.getCreatedAt());
        dto.setUpdatedAt(roleRequest.getUpdatedAt());
        return dto;
    }
}

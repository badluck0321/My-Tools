package com.example.BackEnd_MyTools.Entitys;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

/**
 * A request from an authenticated user to be promoted to a Store Owner or
 * Craftsman. The request is reviewed by an admin; on approval the matching
 * Keycloak realm role is assigned and the user is notified.
 */
@Document(collection = "RoleRequest")
@Data
public class RoleRequest {
    @Id
    public String id;

    /** Keycloak subject (sub) of the user requesting the role. */
    public String userId;

    /** Human readable username (preferred_username) for quick display. */
    public String username;

    /** The role the user is requesting. */
    public RoleRequestType type;

    /** Free text justification provided by the requester. */
    public String description;

    /** Lifecycle state of the request. */
    public RoleRequestStatus status;

    /** Keycloak subject of the admin who reviewed the request. */
    public String reviewedBy;

    /** Optional admin note shown to the requester. */
    public String reviewComment;

    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public enum RoleRequestType {
        STORE_OWNER,
        CRAFTSMAN
    }

    public enum RoleRequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}

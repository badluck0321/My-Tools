package com.example.BackEnd_MyTools.Services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Thin client around the Keycloak Admin REST API used to assign realm roles
 * (mt-StoreOwner / mt-CraftMan) to a user when an admin approves a Demande.
 *
 * It authenticates with the configured admin client (client_credentials grant)
 * and uses the generated admin token to call the users/role-mappings endpoint.
 */
@Service
@Slf4j
public class KeycloakAdminService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${keycloak.admin.realm:myrealm}")
    private String realm;

    @Value("${keycloak.admin.client-id:admin-cli}")
    private String adminClientId;

    @Value("${keycloak.admin.username:}")
    private String adminUsername;

    @Value("${keycloak.admin.password:}")
    private String adminPassword;

    /** Maps the application RoleRequest type to the Keycloak realm role name. */
    public static String roleFor(com.example.BackEnd_MyTools.Entitys.RoleRequest.RoleRequestType type) {
        return type == com.example.BackEnd_MyTools.Entitys.RoleRequest.RoleRequestType.STORE_OWNER
                ? "mt-StoreOwner"
                : "mt-CraftMan";
    }

    public void assignRealmRole(String userId, String roleName) {
        if (adminUsername.isBlank() || adminPassword.isBlank()) {
            log.warn("Keycloak admin credentials are not configured; skipping role assignment for {} -> {}",
                    userId, roleName);
            return;
        }
        try {
            String token = obtainAdminToken();
            String base = issuerUri.replaceAll("/realms/.*", "");
            String usersBase = base + "/admin/realms/" + realm + "/users/" + userId;

            // 1. Fetch the realm role representation
            HttpHeaders roleHeaders = bearer(token);
            ResponseEntity<String> roleResp = restTemplate.exchange(
                    usersBase.replaceFirst("/users/.*", "/roles/" + roleName),
                    HttpMethod.GET, new HttpEntity<>(roleHeaders), String.class);
            JsonNode roleNode = objectMapper.readTree(roleResp.getBody());

            // 2. Assign the role to the user
            HttpHeaders assignHeaders = bearer(token);
            assignHeaders.setContentType(MediaType.APPLICATION_JSON);
            List<Map<String, Object>> body = List.of(Map.of(
                    "id", roleNode.get("id").asText(),
                    "name", roleNode.get("name").asText()));
            restTemplate.exchange(usersBase + "/role-mappings/realm",
                    HttpMethod.POST, new HttpEntity<>(body, assignHeaders), String.class);
            log.info("Assigned realm role {} to user {}", roleName, userId);
        } catch (HttpClientErrorException e) {
            log.error("Keycloak role assignment failed for {} -> {}: {}",
                    userId, roleName, e.getResponseBodyAsString());
            throw new IllegalStateException("Unable to assign Keycloak role " + roleName, e);
        } catch (Exception e) {
            log.error("Keycloak role assignment error for {} -> {}: {}", userId, roleName, e.getMessage());
            throw new IllegalStateException("Unable to assign Keycloak role " + roleName, e);
        }
    }

    private String obtainAdminToken() {
        String base = issuerUri.replaceAll("/realms/.*", "");
        String tokenUrl = base + "/realms/" + realm + "/protocol/openid-connect/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        Map<String, String> form = new HashMap<>();
        form.put("grant_type", "client_credentials");
        form.put("client_id", adminClientId);
        // admin-cli uses username/password; for a dedicated service client use client_secret.
        if (adminClientId.equals("admin-cli")) {
            form.put("username", adminUsername);
            form.put("password", adminPassword);
        } else {
            form.put("client_secret", adminPassword);
        }
        String body = form.entrySet().stream()
                .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                .reduce((a, b) -> a + "&" + b).orElse("");
        ResponseEntity<String> resp = restTemplate.postForEntity(tokenUrl,
                new HttpEntity<>(body, headers), String.class);
        try {
            return objectMapper.readTree(resp.getBody()).get("access_token").asText();
        } catch (Exception e) {
            throw new IllegalStateException("Unable to obtain Keycloak admin token", e);
        }
    }

    private HttpHeaders bearer(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return headers;
    }
}

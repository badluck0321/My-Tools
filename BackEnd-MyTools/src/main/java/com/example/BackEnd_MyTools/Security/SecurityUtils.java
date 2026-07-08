package com.example.BackEnd_MyTools.Security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.security.oauth2.jwt.Jwt;

public final class SecurityUtils {
    private SecurityUtils() {
    }

    public static String currentUserId(Jwt jwt) {
        if (jwt == null) {
            throw new SecurityException("Authentication required");
        }
        String sub = jwt.getClaimAsString("sub");
        if (sub == null || sub.isBlank()) {
            throw new SecurityException("JWT sub claim is missing");
        }
        return sub;
    }

    public static String currentUsername(Jwt jwt) {
        if (jwt == null)
            return "anonymous";
        String preferred = jwt.getClaimAsString("preferred_username");
        if (preferred != null && !preferred.isBlank())
            return preferred;
        String name = jwt.getClaimAsString("name");
        if (name != null && !name.isBlank())
            return name;
        String email = jwt.getClaimAsString("email");
        if (email != null && !email.isBlank())
            return email;
        return currentUserId(jwt);
    }

    public static boolean isAdmin(Jwt jwt) {
        return hasAnyRole(jwt, "mt-admin");
    }

    public static boolean isStoreOwner(Jwt jwt) {
        return hasAnyRole(jwt, "mt-storeowner");
    }

    public static boolean IsCraftsman(Jwt jwt) {
        return hasAnyRole(jwt, "mt-craftsman");
    }

    @SuppressWarnings("unchecked")
    public static boolean hasAnyRole(Jwt jwt, String... acceptedRoles) {
        if (jwt == null || acceptedRoles == null)
            return false;
        List<String> roles = new ArrayList<>();

        Object realmAccess = jwt.getClaims().get("realm_access");
        if (realmAccess instanceof Map<?, ?> realmMap) {
            Object realmRoles = realmMap.get("roles");
            if (realmRoles instanceof Collection<?> collection) {
                collection.forEach(r -> roles.add(String.valueOf(r)));
            }
        }

        Object resourceAccess = jwt.getClaims().get("resource_access");
        if (resourceAccess instanceof Map<?, ?> resourceMap) {
            resourceMap.values().forEach(value -> {
                if (value instanceof Map<?, ?> clientMap) {
                    Object clientRoles = clientMap.get("roles");
                    if (clientRoles instanceof Collection<?> collection) {
                        collection.forEach(r -> roles.add(String.valueOf(r)));
                    }
                }
            });
        }

        Object directRoles = jwt.getClaims().get("roles");
        if (directRoles instanceof Collection<?> collection) {
            collection.forEach(r -> roles.add(String.valueOf(r)));
        }

        for (String accepted : acceptedRoles) {
            if (roles.stream().anyMatch(r -> r.equalsIgnoreCase(accepted)))
                return true;
        }
        return false;
    }
}

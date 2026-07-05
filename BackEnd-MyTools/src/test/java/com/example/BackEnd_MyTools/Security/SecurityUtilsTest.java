package com.example.BackEnd_MyTools.Security;

import com.example.BackEnd_MyTools.testsupport.JwtTestFactory;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import static org.assertj.core.api.Assertions.*;

class SecurityUtilsTest {
    @Test
    void currentUserIdRequiresAuthenticatedJwt() {
        assertThatThrownBy(() -> SecurityUtils.currentUserId(null)).isInstanceOf(SecurityException.class)
                .hasMessageContaining("Authentication required");
    }

    @Test
    void currentUsernameFallsBackToSub() {
        Jwt jwt = Jwt.withTokenValue("token").header("alg", "none").subject("U001").claim("sub", "U001")
                .issuedAt(Instant.now()).expiresAt(Instant.now().plusSeconds(3600)).build();
        assertThat(SecurityUtils.currentUsername(jwt)).isEqualTo("U001");
    }

    @Test
    void detectsAdminRoleFromRealmAccess() {
        assertThat(SecurityUtils.isAdmin(JwtTestFactory.admin("admin-user"))).isTrue();
    }

    @Test
    void detectsRolesFromResourceAccess() {
        Jwt jwt = Jwt.withTokenValue("token").header("alg", "none").subject("owner").claim("sub", "owner")
                .claim("resource_access", Map.of("my-api", Map.of("roles", List.of("mt-StoreOwner"))))
                .issuedAt(Instant.now()).expiresAt(Instant.now().plusSeconds(3600)).build();
        assertThat(SecurityUtils.isStoreOwner(jwt)).isTrue();
    }
}

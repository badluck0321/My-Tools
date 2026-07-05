package com.example.BackEnd_MyTools.testsupport;

import org.springframework.security.oauth2.jwt.Jwt;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public final class JwtTestFactory {
    private JwtTestFactory() {
    }

    public static Jwt user(String sub) {
        return Jwt.withTokenValue("token-" + sub).header("alg", "none").subject(sub).claim("sub", sub)
                .claim("preferred_username", sub + "_name").issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600)).build();
    }

    public static Jwt admin(String sub) {
        return Jwt.withTokenValue("token-" + sub).header("alg", "none").subject(sub).claim("sub", sub)
                .claim("preferred_username", "admin").claim("realm_access", Map.of("roles", List.of("mt-Admin")))
                .issuedAt(Instant.now()).expiresAt(Instant.now().plusSeconds(3600)).build();
    }
}

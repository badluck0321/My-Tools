package com.example.BackEnd_MyTools.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BackEnd_MyTools.Entitys.Favorite;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.FavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<Favorite>> getMyFavorites(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(favoriteService.getFavorites(SecurityUtils.currentUserId(jwt)));
    }

    // Legacy product endpoint kept to avoid breaking existing ProductCard calls.
    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(@PathVariable String productId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean isFavorited = favoriteService.toggle(SecurityUtils.currentUserId(jwt), FavoriteService.PRODUCT, productId);
        return ResponseEntity.ok(Map.of("favorited", isFavorited));
    }

    @PostMapping("/products/{productId}")
    public ResponseEntity<Map<String, Boolean>> toggleProductFavorite(@PathVariable String productId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean isFavorited = favoriteService.toggle(SecurityUtils.currentUserId(jwt), FavoriteService.PRODUCT, productId);
        return ResponseEntity.ok(Map.of("favorited", isFavorited));
    }

    @PostMapping("/masterys/{masteryId}")
    public ResponseEntity<Map<String, Boolean>> toggleMasteryFavorite(@PathVariable String masteryId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean isFavorited = favoriteService.toggle(SecurityUtils.currentUserId(jwt), FavoriteService.MASTERY, masteryId);
        return ResponseEntity.ok(Map.of("favorited", isFavorited));
    }

    @GetMapping("/{productId}/status")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable String productId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean exists = favoriteService.isFavorited(SecurityUtils.currentUserId(jwt), FavoriteService.PRODUCT, productId);
        return ResponseEntity.ok(Map.of("favorited", exists));
    }

    @GetMapping("/products/{productId}/status")
    public ResponseEntity<Map<String, Boolean>> checkProductFavorite(@PathVariable String productId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean exists = favoriteService.isFavorited(SecurityUtils.currentUserId(jwt), FavoriteService.PRODUCT, productId);
        return ResponseEntity.ok(Map.of("favorited", exists));
    }

    @GetMapping("/masterys/{masteryId}/status")
    public ResponseEntity<Map<String, Boolean>> checkMasteryFavorite(@PathVariable String masteryId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean exists = favoriteService.isFavorited(SecurityUtils.currentUserId(jwt), FavoriteService.MASTERY, masteryId);
        return ResponseEntity.ok(Map.of("favorited", exists));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> removeProductFavorite(@PathVariable String productId, @AuthenticationPrincipal Jwt jwt) {
        favoriteService.deleteByUserIdAndTarget(SecurityUtils.currentUserId(jwt), FavoriteService.PRODUCT, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/masterys/{masteryId}")
    public ResponseEntity<Void> removeMasteryFavorite(@PathVariable String masteryId, @AuthenticationPrincipal Jwt jwt) {
        favoriteService.deleteByUserIdAndTarget(SecurityUtils.currentUserId(jwt), FavoriteService.MASTERY, masteryId);
        return ResponseEntity.noContent().build();
    }
}

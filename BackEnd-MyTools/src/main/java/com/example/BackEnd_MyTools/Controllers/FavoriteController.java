package com.example.BackEnd_MyTools.Controllers;
import com.example.BackEnd_MyTools.DTO.AddToCartRequest;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Entitys.Favorite;
import com.example.BackEnd_MyTools.Services.CartService;
import com.example.BackEnd_MyTools.Services.FavoriteService;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // get all favorites for logged user
    @GetMapping
    public ResponseEntity<List<Favorite>> getMyFavorites(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
            favoriteService.getFavorites(jwt.getClaim("sub"))
        );
    }

    // toggle — adds if not exists, removes if exists
    @PostMapping("/{productId}")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable String productId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean isFavorited = favoriteService.toggle(jwt.getClaim("sub"), productId);
        return ResponseEntity.ok(Map.of("favorited", isFavorited));
    }

    // check if a product is favorited
    @GetMapping("/{productId}/status")
    public ResponseEntity<?> checkFavorite(
            @PathVariable String productId,
            @AuthenticationPrincipal Jwt jwt) {
        boolean exists = favoriteService.isFavorited(jwt.getClaim("sub"), productId);
        return ResponseEntity.ok(Map.of("favorited", exists));
    }
}
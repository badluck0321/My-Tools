package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.DTO.AddToCartRequest;
import com.example.BackEnd_MyTools.DTO.UpdateCartQuantityRequest;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.getOrCreateCart(SecurityUtils.currentUserId(jwt)));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(@RequestBody AddToCartRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.addItem(SecurityUtils.currentUserId(jwt), request));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateQuantity(@PathVariable String productId, @RequestBody UpdateCartQuantityRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.updateQuantity(SecurityUtils.currentUserId(jwt), productId, request.getQuantity()));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItem(@PathVariable String productId, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.removeItem(SecurityUtils.currentUserId(jwt), productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal Jwt jwt) {
        cartService.clearCart(SecurityUtils.currentUserId(jwt));
        return ResponseEntity.noContent().build();
    }
}

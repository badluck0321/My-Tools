package com.example.BackEnd_MyTools.Controllers;
import com.example.BackEnd_MyTools.DTO.AddToCartRequest;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Services.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.getOrCreateCart(jwt.getClaim("sub")));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(
            @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.addItem(jwt.getClaim("sub"), request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItem(
            @PathVariable String productId,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.removeItem(jwt.getClaim("sub"), productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal Jwt jwt) {
        cartService.clearCart(jwt.getClaim("sub"));
        return ResponseEntity.noContent().build();
    }
}
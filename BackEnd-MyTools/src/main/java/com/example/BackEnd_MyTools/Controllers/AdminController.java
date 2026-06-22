package com.example.BackEnd_MyTools.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Services.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final ProductService productService;

    @PatchMapping("/products/{id}/hide")
    public ResponseEntity<Product> hideProduct(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(productService.hideProduct(id, jwt));
    }
}

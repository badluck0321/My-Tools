package com.example.BackEnd_MyTools.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Services.RecommendationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;

    @GetMapping("/products/{productId}")
    public ResponseEntity<List<Product>> similar(@PathVariable String productId) {
        return ResponseEntity.ok(recommendationService.similarProducts(productId));
    }
}

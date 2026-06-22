package com.example.BackEnd_MyTools.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Services.SmartSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai/search")
@RequiredArgsConstructor
public class SmartSearchController {
    private final SmartSearchService smartSearchService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> products(@RequestParam String q) {
        return ResponseEntity.ok(smartSearchService.searchProducts(q));
    }
}

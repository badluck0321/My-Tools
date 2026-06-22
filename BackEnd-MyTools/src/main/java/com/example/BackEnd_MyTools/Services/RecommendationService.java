package com.example.BackEnd_MyTools.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final ProductRepo productRepo;

    public List<Product> similarProducts(String productId) {
        Product product = productRepo.findById(productId).orElseThrow(() -> new IllegalArgumentException("Product not found"));
        List<Product> sameCategory = productRepo.findRecommended(product.getCategoryId(), product.getId());
        if (sameCategory.size() >= 8 || product.getTags() == null || product.getTags().isEmpty()) return sameCategory;
        List<Product> all = productRepo.findAll();
        sameCategory.addAll(all.stream()
            .filter(p -> !p.getId().equals(product.getId()))
            .filter(p -> p.getTags() != null && p.getTags().stream().anyMatch(product.getTags()::contains))
            .limit(8 - sameCategory.size())
            .collect(Collectors.toList()));
        return sameCategory.stream().limit(8).toList();
    }
}

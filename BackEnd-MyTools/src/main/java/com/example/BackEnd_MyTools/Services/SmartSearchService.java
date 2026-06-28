package com.example.BackEnd_MyTools.Services;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Product;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SmartSearchService {
    private final ProductService productService;

    public List<Product> searchProducts(String query) {
        if (query == null || query.isBlank())
            return productService.getAllProductsSpecs(null, null, true, null, null, null, null, null);
        String normalized = query.toLowerCase();
        Integer categoryId = inferCategory(normalized);
        String name = normalized.replaceAll("under\\s+\\d+", "").replaceAll("less than\\s+\\d+", "").trim();
        List<Product> results = productService.getAllProductsSpecs(categoryId, null, true, name.isBlank() ? null : name,
                null, null, null, null);
        Integer maxPrice = inferMaxPrice(normalized);
        if (maxPrice != null) {
            results = results.stream().filter(p -> p.getPrice() <= maxPrice).toList();
        }
        return results;
    }

    private Integer inferCategory(String q) {
        if (q.contains("drill") || q.contains("tool") || q.contains("construction"))
            return 1;
        if (q.contains("camera") || q.contains("photo"))
            return 2;
        if (q.contains("garden") || q.contains("lawn"))
            return 3;
        if (q.contains("computer") || q.contains("laptop"))
            return 4;
        return null;
    }

    private Integer inferMaxPrice(String q) {
        Matcher matcher = Pattern.compile("(?:under|less than)\\s+(\\d+)").matcher(q);
        return matcher.find() ? Integer.valueOf(matcher.group(1)) : null;
    }
}

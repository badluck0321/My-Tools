package com.example.BackEnd_MyTools.bootstrap;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class ProductSeeder {

    private final ProductRepo productRepository;
    private final ObjectMapper objectMapper;

    public ProductSeeder(ProductRepo productRepository, ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    public void seed() {

        if (productRepository.count() > 0) {
            System.out.println("[Seeder] Product already exists, skipping...");
            return;
        }

        try (InputStream inputStream = new ClassPathResource("seed/product.json").getInputStream()) {

            List<Product> products = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<Product>>() {
                    });

            productRepository.saveAll(products);

            System.out.println("[Seeder] Product seeded successfully!");

        } catch (Exception e) {
            throw new RuntimeException("Failed to seed Product data", e);
        }
    }
}
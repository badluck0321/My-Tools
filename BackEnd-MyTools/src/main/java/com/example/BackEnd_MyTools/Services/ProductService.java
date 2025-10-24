package com.example.BackEnd_MyTools.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;

@Service
public class ProductService {
    private final ProductRepo productRepo;

    public ProductService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product getProductById(int id) {
        return productRepo.findById(id).orElse(null);
    }

    public Product createProduct(Product product) {
        return productRepo.save(product);
    }

    public Product updateProduct(int id, Product updatedProduct) {
        return productRepo.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setCategoryId(updatedProduct.getCategoryId());
            product.setMarkId(updatedProduct.getMarkId());
            product.setSerieNum(updatedProduct.getSerieNum());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setListedFor(updatedProduct.getListedFor());
            product.setDuration(updatedProduct.getDuration());
            product.setIsavailable(updatedProduct.isIsavailable());
            return productRepo.save(product);
        }).orElse(null);
    }
    
    public void deleteProduct(int id) {
        productRepo.deleteById(id);
    }
    
}

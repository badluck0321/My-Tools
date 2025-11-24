package com.example.BackEnd_MyTools.Services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.Specifications.ProductSpecs;

@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final MongoTemplate mongoTemplate;

    public ProductService(ProductRepo productRepo, MongoTemplate mongoTemplate) {
        this.productRepo = productRepo;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public List<Product> getAllProductsSpecs(Integer categoryId, Integer markId, Boolean available, String name) {
        List<Criteria> criteriaList = new ArrayList<>();

        Criteria c1 = ProductSpecs.hasCategoryId(categoryId);
        Criteria c2 = ProductSpecs.hasMarkId(markId);
        Criteria c3 = ProductSpecs.isAvailable(available);
        Criteria c4 = ProductSpecs.hasNameLike(name);

        if (c1 != null)
            criteriaList.add(c1);
        if (c2 != null)
            criteriaList.add(c2);
        if (c3 != null)
            criteriaList.add(c3);
        if (c4 != null)
            criteriaList.add(c4);

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Product.class);
    }

    public Product getProductById(String id) {
        return productRepo.findById(id).orElse(null);
    }

    public Product createProduct(Product product) {
        return productRepo.save(product);
    }

    public Product updateProduct(String id, Product updatedProduct) {
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
            // ✅ update photos (replace or merge)
            if (updatedProduct.getPhotoIds() != null && !updatedProduct.getPhotoIds().isEmpty()) {
                product.setPhotoIds(updatedProduct.getPhotoIds());
            }
            return productRepo.save(product);
        }).orElse(null);
    }

    public void deleteProduct(String id) {
        productRepo.deleteById(id);
    }

}

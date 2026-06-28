package com.example.BackEnd_MyTools.Services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
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

    public List<Product> getAllProductsSpecs(Integer categoryId, Integer markId, Boolean available, String name,
            Double latitude, Double longitude, Double radiusKm, String ownerId) {
        List<Criteria> criteriaList = new ArrayList<>();

        Criteria c1 = ProductSpecs.hasCategoryId(categoryId);
        Criteria c2 = ProductSpecs.hasMarkId(markId);
        Criteria c3 = ProductSpecs.isAvailable(available);
        Criteria c4 = ProductSpecs.hasNameLike(name);
        Criteria c5 = ProductSpecs.hasOwnerId(ownerId);

        if (c1 != null)
            criteriaList.add(c1);
        if (c2 != null)
            criteriaList.add(c2);
        if (c3 != null)
            criteriaList.add(c3);
        if (c4 != null)
            criteriaList.add(c4);
        if (c5 != null)
            criteriaList.add(c5);
        criteriaList.add(
                new Criteria().orOperator(Criteria.where("hidden").exists(false), Criteria.where("hidden").is(false)));

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }
        if (latitude != null && longitude != null && radiusKm != null && radiusKm > 0) {
            query.addCriteria(Criteria.where("location").nearSphere(new Point(longitude, latitude))
                    .maxDistance(radiusKm / 6378.1));
        }

        return mongoTemplate.find(query, Product.class);
    }

    public Product getProductById(String id) {
        Product product = productRepo.findById(id).orElse(null);
        if (product != null && product.isHidden())
            return null;
        return product;
    }

    public List<Product> getMyProducts(String ownerId) {
        return productRepo.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public Product createProduct(Product product, String ownerId) {
        product.setOwnerId(ownerId);
        product.setCreatedAt(Instant.now());
        product.setUpdatedAt(Instant.now());
        product.setModerationStatus(product.getModerationStatus() == null ? "APPROVED" : product.getModerationStatus());
        syncLocation(product);
        return productRepo.save(product);
    }

    public Product updateProduct(String id, Product updatedProduct, Jwt jwt) {
        return productRepo.findById(id).map(product -> {
            assertCanManage(product, jwt);
            product.setName(updatedProduct.getName());
            product.setCategoryId(updatedProduct.getCategoryId());
            product.setMarkId(updatedProduct.getMarkId());
            product.setSerieNum(updatedProduct.getSerieNum());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setTags(updatedProduct.getTags());
            product.setConditionId(updatedProduct.getConditionId());
            product.setListedForId(updatedProduct.getListedForId());
            product.setCurrencyId(updatedProduct.getCurrencyId());
            product.setDuration(updatedProduct.getDuration());
            product.setIsavailable(updatedProduct.isIsavailable());
            product.setCity(updatedProduct.getCity());
            product.setLatitude(updatedProduct.getLatitude());
            product.setLongitude(updatedProduct.getLongitude());
            if (updatedProduct.getPhotoUrls() != null && !updatedProduct.getPhotoUrls().isEmpty()) {
                product.setPhotoUrls(updatedProduct.getPhotoUrls());
            }
            product.setUpdatedAt(Instant.now());
            syncLocation(product);
            return productRepo.save(product);
        }).orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    public void deleteProduct(String id, Jwt jwt) {
        Product product = productRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found"));
        assertCanManage(product, jwt);
        productRepo.deleteById(id);
    }

    public Product hideProduct(String id, Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt))
            throw new SecurityException("Admin role required");
        Product product = productRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setHidden(true);
        product.setModerationStatus("HIDDEN");
        product.setUpdatedAt(Instant.now());
        return productRepo.save(product);
    }

    private void assertCanManage(Product product, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        if (!SecurityUtils.isAdmin(jwt) && (product.getOwnerId() == null || !product.getOwnerId().equals(userId))) {
            throw new SecurityException("You can only manage your own product listings");
        }
    }

    private void syncLocation(Product product) {
        if (product.getLatitude() != null && product.getLongitude() != null) {
            product.setLocation(new GeoJsonPoint(product.getLongitude(), product.getLatitude()));
        }
    }
}

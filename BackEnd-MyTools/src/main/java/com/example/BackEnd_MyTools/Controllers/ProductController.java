package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.DTO.DtoGetProduct;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Mapper.ProductMapper;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.PhotoService;
import com.example.BackEnd_MyTools.Services.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final PhotoService photoService;
    private final ProductMapper productMapper;

    public ProductController(ProductService productService, PhotoService photoService, ProductMapper productMapper) {
        this.productService = productService;
        this.photoService = photoService;
        this.productMapper = productMapper;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
            @AuthenticationPrincipal Jwt jwt) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Product product = mapper.readValue(productJson, Product.class);
            if (photos != null && !photos.isEmpty()) {
                List<String> photoIds = new ArrayList<>();
                for (MultipartFile photo : photos)
                    photoIds.add(photoService.savePhoto(photo));
                product.setPhotoUrls(photoIds);
            }
            Product createdProduct = productService.createProduct(product, SecurityUtils.currentUserId(jwt));
            return ResponseEntity.ok(createdProduct);
        } catch (SecurityException | IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur lors de la création : " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<DtoGetProduct>> getAllProductsSpect(HttpServletRequest request,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer markId,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double radiusKm,
            @RequestParam(required = false) String ownerId) {
        List<Product> products = productService.getAllProductsSpecs(categoryId, markId, available, name, latitude,
                longitude, radiusKm, ownerId);
        String baseUrl = String.format("%s://%s:%d%s", request.getScheme(), request.getServerName(),
                request.getServerPort(), request.getContextPath());
        return ResponseEntity.ok(productMapper.toDtoList(products, baseUrl));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Product>> getMyProducts(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(productService.getMyProducts(SecurityUtils.currentUserId(jwt)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoGetProduct> getProductById(@PathVariable String id, HttpServletRequest request) {
        Product product = productService.getProductById(id);
        if (product == null)
            return ResponseEntity.notFound().build();
        String baseUrl = String.format("%s://%s:%d%s", request.getScheme(), request.getServerName(),
                request.getServerPort(), request.getContextPath());
        return ResponseEntity.ok(productMapper.toDto(product, baseUrl));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable String id,
            @RequestPart("product") String updatedProductJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> newPhotos,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            Product updatedProduct = new ObjectMapper().readValue(updatedProductJson, Product.class);
            if (newPhotos != null && !newPhotos.isEmpty()) {
                List<String> photoIds = new ArrayList<>();
                for (MultipartFile photo : newPhotos)
                    photoIds.add(photoService.savePhoto(photo));
                updatedProduct.setPhotoUrls(photoIds);
            }
            return ResponseEntity.ok(productService.updateProduct(id, updatedProduct, jwt));
        } catch (SecurityException | IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur lors de la mise à jour : " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductById(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        productService.deleteProduct(id, jwt);
        return ResponseEntity.ok().body("Produit supprimé avec succès");
    }

    @GetMapping("/photos/{photoUrls}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String photoUrls) throws IOException {
        return photoService.getPhoto(photoUrls)
                .map(photoData -> ResponseEntity.ok().contentType(MediaType.parseMediaType(photoData.contentType()))
                        .body(photoData.bytes()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

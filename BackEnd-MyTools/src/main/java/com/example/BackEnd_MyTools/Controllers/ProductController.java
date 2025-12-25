package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Services.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import com.example.BackEnd_MyTools.Services.PhotoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.example.BackEnd_MyTools.DTO.DtoGetProduct;
import com.example.BackEnd_MyTools.Mapper.ProductMapper;

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

    // ✅ CREATE PRODUCT (with optional photos)
    // {
    // "name": "Electric Drill",
    // "categoryId": 3,
    // "markId": 12,
    // "serieNum": 8456321,
    // "description": "Professional drill",
    // "price": "1200",
    // "listedFor": 30,
    // "duration": 12,
    // "photoIds": [],
    // "isavailable": true
    // }
    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        try {
            // ✅ Manually convert JSON to Product
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productJson, Product.class);

            if (photos != null && !photos.isEmpty()) {
                List<String> photoIds = new ArrayList<>();
                for (MultipartFile photo : photos) {
                    String id = photoService.savePhoto(photo);
                    photoIds.add(id);
                }
                product.setPhotoIds(photoIds);
            }

            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.ok(createdProduct);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Erreur lors de la création : " + ex.getMessage());
        }
    }

    // ✅ CREATE PRODUCT (with optional photos)
    // @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<?> createProduct(
    // @RequestPart("product") Product product,
    // @RequestPart(value = "photos", required = false) List<MultipartFile> photos)
    // {
    // try {
    // if (photos != null && !photos.isEmpty()) {
    // List<String> photoIds = new ArrayList<>();
    // for (MultipartFile photo : photos) {
    // String id = photoService.savePhoto(photo);
    // photoIds.add(id);
    // }
    // product.setPhotoIds(photoIds);
    // }

    // Product createdProduct = productService.createProduct(product);
    // return ResponseEntity.ok(createdProduct);
    // } catch (Exception ex) {
    // return ResponseEntity.status(500).body("Erreur lors de la création : " +
    // ex.getMessage());
    // }
    // } 
    
    // ✅ GET ALL PRODUCTS
    @GetMapping("/GetAllProductsDTO")
    public ResponseEntity<List<DtoGetProduct>> getAllProductsDTO(HttpServletRequest request) {
        try {
            List<Product> products = productService.getAllProducts();
            if (products.isEmpty())
                return ResponseEntity.noContent().build();
            String baseUrl = String.format("%s://%s:%d%s", request.getScheme(),
                    request.getServerName(),
                    request.getServerPort(), request.getContextPath());

            List<DtoGetProduct> dtoProducts = productMapper.toDtoList(products, baseUrl);
            return ResponseEntity.ok(dtoProducts);
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ GET ALL PRODUCTS WITH SPECS
    @GetMapping
    public ResponseEntity<List<DtoGetProduct>> getAllProductsSpect(HttpServletRequest request,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer markId,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String name) {
        try {
            List<Product> products = productService.getAllProductsSpecs(categoryId, markId, available, name);
            if (products.isEmpty())
                return ResponseEntity.noContent().build();
            String baseUrl = String.format("%s://%s:%d%s", request.getScheme(),
                    request.getServerName(),
                    request.getServerPort(), request.getContextPath());

            List<DtoGetProduct> dtoProducts = productMapper.toDtoList(products, baseUrl);
            return ResponseEntity.ok(dtoProducts);
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    // @GetMapping
    // public ResponseEntity<List<Product>> getAllProducts() {
    // try {
    // List<Product> products = productService.getAllProducts();
    // if (products.isEmpty()) {
    // return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    // }
    // return ResponseEntity.ok(products);
    // } catch (Exception ex) {
    // return ResponseEntity.status(500).build();
    // }
    // }

    // ✅ GET PRODUCT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        try {
            Product product = productService.getProductById(id);
            if (product == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok(product);
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ UPDATE PRODUCT (with optional new photos)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable String id,
            @RequestPart("product") Product updatedProduct,
            @RequestPart(value = "photos", required = false) List<MultipartFile> newPhotos) {
        try {
            if (newPhotos != null && !newPhotos.isEmpty()) {
                List<String> photoIds = new ArrayList<>();
                for (MultipartFile photo : newPhotos) {
                    String photoId = photoService.savePhoto(photo);
                    photoIds.add(photoId);
                }
                updatedProduct.setPhotoIds(photoIds);
            }

            productService.updateProduct(id, updatedProduct);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur lors de la mise à jour : " + ex.getMessage());
        }
    }

    // ✅ DELETE PRODUCT
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductById(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().body("Produit supprimé avec succès");
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur : " + ex.getMessage());
        }
    }

    // ✅ GET PHOTO BY ID (for React display)
    @GetMapping("/photos/{photoId}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String photoId) throws IOException {
        return photoService.getPhoto(photoId)
                .map(photoData -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(photoData.contentType()))
                        .body(photoData.bytes()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

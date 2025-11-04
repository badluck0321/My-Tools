package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Services.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

import com.example.BackEnd_MyTools.Services.PhotoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000") // allow React dev server
public class ProductController {

    private final ProductService productService;
    private final PhotoService photoService;

    public ProductController(ProductService productService, PhotoService photoService) {
        this.productService = productService;
        this.photoService = photoService;
    }

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
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(HttpServletRequest request) {
        try {
            List<Product> products = productService.getAllProducts();

            String baseUrl = String.format("%s://%s:%d%s",
                    request.getScheme(),
                    request.getServerName(),
                    request.getServerPort(),
                    request.getContextPath()); // e.g., http://localhost:8888

            products.forEach(product -> {
                List<String> urls = product.getPhotoIds().stream()
                        .map(id -> baseUrl + "/products/photo/" + id) // convert ID to URL
                        .collect(Collectors.toList());
                product.setPhotoIds(urls); // replace IDs with URLs
            });

            if (products.isEmpty())
                return ResponseEntity.noContent().build();

            return ResponseEntity.ok(products);
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

// package com.example.BackEnd_MyTools.Controllers;
// import java.util.List;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import com.example.BackEnd_MyTools.Entitys.Product;
// import com.example.BackEnd_MyTools.Services.ProductService;

// @RestController
// public class ProductController {
// private final ProductService productService;

// public ProductController(ProductService productService) {
// this.productService = productService;
// }

// @PostMapping("/products")
// // @PreAuthorize("hasRole('ADMIN')")
// public ResponseEntity<?> createProduct(Product product) {
// try {
// Product produit = productService.createProduct(product);
// return ResponseEntity.ok(produit);
// } catch (Exception ex) {
// return ResponseEntity.status(500).body("Erreur " + ex.getMessage());
// }
// }

// @GetMapping("/products")
// public ResponseEntity<List<Product>> getAllProducts() {
// List<Product> products = productService.getAllProducts();
// try {
// if (products.isEmpty()) {
// return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
// } else {
// return ResponseEntity.ok(products);
// }
// } catch (Exception ex) {
// return ResponseEntity.badRequest().build();
// }

// }

// @GetMapping("/products/{id}")
// public ResponseEntity<Product> getProductById(int id) {
// try {
// Product produit = productService.getProductById(id);
// if (produit == null)
// return ResponseEntity.notFound().build();
// else
// return ResponseEntity.ok(produit);
// } catch (Exception ex) {
// return ResponseEntity.badRequest().build();
// }
// }

// @PutMapping("/products/{id}")
// public ResponseEntity<?> updateProduct(int id, Product updatedProduct) {
// try {
// productService.updateProduct(id, updatedProduct);
// return ResponseEntity.ok(updatedProduct);
// } catch (Exception ex) {
// return ResponseEntity.status(500).body("Erreur " + ex.getMessage());
// }
// }

// @DeleteMapping("/products/{id}")
// public ResponseEntity<?> deleteProductById(int id) {
// try {
// productService.deleteProduct(id);
// return ResponseEntity.ok().body("Produit supprimé avec succès");
// } catch (Exception ex) {
// return ResponseEntity.status(500).body("Erreur" + ex.getMessage());
// }
// }

// }

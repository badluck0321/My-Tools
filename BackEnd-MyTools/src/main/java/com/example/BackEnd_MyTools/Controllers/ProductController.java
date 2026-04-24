package com.example.BackEnd_MyTools.Controllers;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Mapper.ProductMapper;
import com.example.BackEnd_MyTools.Services.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import com.example.BackEnd_MyTools.Services.PhotoService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.example.BackEnd_MyTools.DTO.DtoGetProduct;


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

    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos, @AuthenticationPrincipal Jwt jwt) {
        try {
            // ✅ Manually convert JSON to Product
            String sub = jwt.getClaim("sub");
            if (sub == null || sub.isEmpty()) {
                return ResponseEntity.status(401).body("Utilisateur non authentifié");
                
            }
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productJson, Product.class);

            if (photos != null && !photos.isEmpty()) {
                List<String> photoUrls = new ArrayList<>();
                for (MultipartFile photo : photos) {
                    String id = photoService.savePhoto(photo);
                    photoUrls.add(id);
                }
                product.setPhotoUrls(photoUrls);
            }

            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.ok(createdProduct);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Erreur lors de la création : " + ex.getMessage());
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
            @RequestPart("product") String updatedProductJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> newPhotos) {
        try {

            ObjectMapper mapper = new ObjectMapper();
            Product updatedProduct = mapper.readValue(updatedProductJson, Product.class);

            if (newPhotos != null && !newPhotos.isEmpty()) {
                List<String> photoUrls = new ArrayList<>();
                for (MultipartFile photo : newPhotos) {
                    String photoId = photoService.savePhoto(photo);
                    photoUrls.add(photoId);
                }
                updatedProduct.setPhotoUrls(photoUrls);
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


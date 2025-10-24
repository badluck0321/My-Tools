package com.example.BackEnd_MyTools.Controllers;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Services.ProductService;

@RestController
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService; 
    }

    @PostMapping("/products")
    // @PreAuthorize("hasRole('ADMIN')")
    public void createProduct(Product product) {
        productService.createProduct(product);
    }
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.ok(products);
        }
    }

    @GetMapping("/products/{id}")
    public Product getProductById(int id) {
        return productService.getProductById(id);
    }

    @PutMapping("/products/{id}")
    public void updateProduct(int id, Product updatedProduct) {
        productService.updateProduct(id, updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProductById(int id) {
        productService.deleteProduct(id);
    }

}

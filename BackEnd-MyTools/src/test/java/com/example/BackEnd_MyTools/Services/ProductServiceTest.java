package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.testsupport.JwtTestFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock
    ProductRepo productRepo;
    @Mock
    MongoTemplate mongoTemplate;
    @InjectMocks
    ProductService productService;

    @Test
    void updateProductKeepsExistingPhotosWhenNoNewPhotosAreProvided() {
        Product e = new Product();
        e.setId("P001");
        e.setOwnerId("U001");
        e.setPhotoUrls(List.of("photo-1"));
        Product u = new Product();
        u.setName("Updated drill");
        u.setPhotoUrls(null);
        u.setPrice(1000);
        u.setIsavailable(true);
        when(productRepo.findById("P001")).thenReturn(Optional.of(e));
        when(productRepo.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));
        Product saved = productService.updateProduct("P001", u, JwtTestFactory.user("U001"));
        assertThat(saved.getName()).isEqualTo("Updated drill");
        assertThat(saved.getPhotoUrls()).containsExactly("photo-1");
    }

    @Test
    void updateProductRejectsNonOwner() {
        Product e = new Product();
        e.setId("P001");
        e.setOwnerId("OWNER");
        when(productRepo.findById("P001")).thenReturn(Optional.of(e));
        assertThatThrownBy(() -> productService.updateProduct("P001", new Product(), JwtTestFactory.user("OTHER")))
                .isInstanceOf(SecurityException.class);
    }

    @Test
    void getProductByIdDoesNotExposeHiddenProducts() {
        Product h = new Product();
        h.setId("P001");
        h.setHidden(true);
        when(productRepo.findById("P001")).thenReturn(Optional.of(h));
        assertThat(productService.getProductById("P001")).isNull();
    }
}

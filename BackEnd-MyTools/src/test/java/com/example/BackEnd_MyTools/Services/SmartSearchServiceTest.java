package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.Entitys.Product;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SmartSearchServiceTest {
    @Mock
    ProductService productService;
    @InjectMocks
    SmartSearchService smartSearchService;

    @Test
    void searchProductsInfersCategoryAndMaxPrice() {
        Product cheap = product("P001", 800);
        Product expensive = product("P002", 1400);
        when(productService.getAllProductsSpecs(1, null, true, "drill", null, null, null, null))
                .thenReturn(List.of(cheap, expensive));
        List<Product> results = smartSearchService.searchProducts("drill under 1000");
        assertThat(results).containsExactly(cheap);
        verify(productService).getAllProductsSpecs(1, null, true, "drill", null, null, null, null);
    }

    @Test
    void blankQueryReturnsAvailableProducts() {
        when(productService.getAllProductsSpecs(null, null, true, null, null, null, null, null))
                .thenReturn(List.of(product("P001", 100)));
        assertThat(smartSearchService.searchProducts("   ")).hasSize(1);
    }

    private Product product(String id, int price) {
        Product p = new Product();
        p.setId(id);
        p.setPrice(price);
        return p;
    }
}

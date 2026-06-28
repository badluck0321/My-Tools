package com.example.BackEnd_MyTools.Controllers;

import com.example.BackEnd_MyTools.DTO.DtoGetProduct;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Mapper.ProductMapper;
import com.example.BackEnd_MyTools.Services.PhotoService;
import com.example.BackEnd_MyTools.Services.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerWebTest {
    @Autowired
    MockMvc mockMvc;
    @MockBean
    ProductService productService;
    @MockBean
    PhotoService photoService;
    @MockBean
    ProductMapper productMapper;

    @Test
    void getAllProductsReturnsMappedDtos() throws Exception {
        Product p = new Product();
        p.setId("P001");
        p.setName("Bosch Drill");
        DtoGetProduct dto = new DtoGetProduct();
        dto.setId("P001");
        dto.setName("Bosch Drill");
        dto.setPhotoUrls(List.of("http://localhost/products/photos/photo-1"));
        when(productService.getAllProductsSpecs(null, null, null, null, null, null, null, null)).thenReturn(List.of(p));
        when(productMapper.toDtoList(eq(List.of(p)), anyString())).thenReturn(List.of(dto));
        mockMvc.perform(get("/products")).andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value("P001"))
                .andExpect(jsonPath("$[0].name").value("Bosch Drill"));
    }

    @Test
    void getProductByIdReturnsNotFoundWhenHiddenOrMissing() throws Exception {
        when(productService.getProductById("P404")).thenReturn(null);
        mockMvc.perform(get("/products/P404")).andExpect(status().isNotFound());
    }
}

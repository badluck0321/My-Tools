package com.example.BackEnd_MyTools.Mapper;

import com.example.BackEnd_MyTools.DTO.DtoGetProduct;
import com.example.BackEnd_MyTools.Entitys.Product;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class ProductMapperTest {
    private final ProductMapper mapper = Mappers.getMapper(ProductMapper.class);

    @Test
    void mapsGridFsPhotoIdsToProductPhotoEndpoint() {
        Product p = new Product();
        p.setId("P001");
        p.setName("Drill");
        p.setPhotoUrls(List.of("64d000000000000000000001"));
        DtoGetProduct dto = mapper.toDto(p, "http://localhost:8888");
        assertThat(dto.getPhotoUrls())
                .containsExactly("http://localhost:8888/products/photos/64d000000000000000000001");
    }
}

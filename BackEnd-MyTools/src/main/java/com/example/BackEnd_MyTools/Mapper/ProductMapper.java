package com.example.BackEnd_MyTools.Mapper;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.DTO.DtoGetProduct;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "photoUrls", ignore = true)

    DtoGetProduct toDto(Product product, @Context String baseUrl);

    List<DtoGetProduct> toDtoList(List<Product> products, @Context String baseUrl);

    @AfterMapping
    default void mapPhotos(Product product,
            @MappingTarget DtoGetProduct dto,
            @Context String baseUrl) {

        if (product.getPhotoUrls() != null) {
            dto.setPhotoUrls(
                    product.getPhotoUrls()
                            .stream()
                            .map(ref -> mapPhotoRef(ref, baseUrl, "products"))
                            .toList());
        }
    }
    default String mapPhotoRef(String ref, String baseUrl, String endpoint) {
        if (ref == null || ref.isBlank()) return ref;
        if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("data:")) return ref;
        return baseUrl + "/" + endpoint + "/photos/" + ref;
    }

}
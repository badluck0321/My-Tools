package com.example.BackEnd_MyTools.Mapper;

import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.DTO.DtoGetProduct;
import org.mapstruct.*;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "photoIds", expression = "java(mapPhotoUrls(product.getPhotoIds(), baseUrl))")
    DtoGetProduct toDto(Product product, @Context String baseUrl);

    List<DtoGetProduct> toDtoList(List<Product> products, @Context String baseUrl);

    // Helper method to convert IDs to URLs
    default List<String> mapPhotoUrls(List<String> photoIds, @Context String baseUrl) {
        if (photoIds == null)
            return null;
        return photoIds.stream()
                .map(id -> baseUrl + "/products/photos/" + id)
                .collect(Collectors.toList());
    }
}

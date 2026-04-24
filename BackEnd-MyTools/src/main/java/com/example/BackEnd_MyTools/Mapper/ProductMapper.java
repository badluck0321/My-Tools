package com.example.BackEnd_MyTools.Mapper;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.DTO.DtoGetProduct;
import org.mapstruct.*;
import java.util.List;
import java.util.stream.Collectors;

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
                    .map(id -> baseUrl + "/products/photos/" + id)
                    .toList()
            );
        }
    }
}
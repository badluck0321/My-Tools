package com.example.BackEnd_MyTools.Mapper;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.DTO.DtoGetMastery;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MasteryMapper {

    @Mapping(target = "photoId", expression = "java(mapPhotoUrl(mastery.getPhoto(), baseUrl))")
    DtoGetMastery toDto(Mastery mastery, @Context String baseUrl);

    @IterableMapping(elementTargetType = DtoGetMastery.class)
    List<DtoGetMastery> toDtoList(List<Mastery> masteries, @Context String baseUrl);

    default String mapPhotoUrl(String photoId, @Context String baseUrl) {
        if (photoId == null)
            return null;
        return baseUrl + "/masterys/photo/" + photoId;
    }
    List<DtoGetMastery> toDtoList(List<Mastery> masterys);

}
// package com.example.BackEnd_MyTools.Mapper;
// import com.example.BackEnd_MyTools.Entitys.Mastery;
// import com.example.BackEnd_MyTools.Entitys.Product;
// import com.example.BackEnd_MyTools.DTO.DtoGetMastery;

// import org.mapstruct.*;
// import java.util.List;
// import java.util.stream.Collectors;

// @Mapper(componentModel = "spring")
// public interface MasteryMapper {
//     @Mapping(target = "photoId", expression = "java(mapPhotoUrls(mastery.getPhoto(), baseUrl))")
//     DtoGetMastery toDto(Mastery mastery, @Context String baseUrl);

//     // Helper method to convert IDs to URLs
//     default List<String> mapPhotoUrls(String photoId, @Context String baseUrl) {
//         if (photoId == null)
//             return null;
//         return List.of(baseUrl + "/products/photos/" + photoId);
//     }
    
//     List<DtoGetMastery> toDtoList(List<Mastery> masterys);
// }

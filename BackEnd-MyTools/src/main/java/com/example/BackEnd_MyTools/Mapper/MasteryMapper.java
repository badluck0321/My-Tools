package com.example.BackEnd_MyTools.Mapper;
import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.DTO.DtoGetMastery;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MasteryMapper {

    @Mapping(target = "photoId", qualifiedByName = "mapPhotoUrl")  // ← qualifiedByName not expression
    DtoGetMastery toDto(Mastery mastery, @Context String baseUrl);

    List<DtoGetMastery> toDtoList(List<Mastery> masteries, @Context String baseUrl);

    @Named("mapPhotoUrl")
    default String mapPhotoUrl(String photoId, @Context String baseUrl) {
        if (photoId == null)
            return null;
        return baseUrl + "/masterys/photo/" + photoId;
    }
}
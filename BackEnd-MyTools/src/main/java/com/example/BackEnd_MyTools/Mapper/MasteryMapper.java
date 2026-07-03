package com.example.BackEnd_MyTools.Mapper;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.DTO.DtoGetMastery;

import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MasteryMapper {

    @Mapping(target = "photoUrls", ignore = true)
    @Mapping(target = "typeId", source = "masteryTypeId")

    DtoGetMastery toDto(Mastery mastery, @Context String baseUrl);

    List<DtoGetMastery> toDtoList(List<Mastery> masteries, @Context String baseUrl);

    @AfterMapping
    default void mapPhotos(Mastery mastery,
            @MappingTarget DtoGetMastery dto,
            @Context String baseUrl) {

        if (mastery.getPhotoUrls() != null) {
            dto.setPhotoUrls(
                    mastery.getPhotoUrls()
                            .stream()
                            .map(ref -> mapPhotoRef(ref, baseUrl, "masterys"))
                            .toList());
        }
    }
    default String mapPhotoRef(String ref, String baseUrl, String endpoint) {
        if (ref == null || ref.isBlank()) return ref;
        if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("data:")) return ref;
        return baseUrl + "/" + endpoint + "/photos/" + ref;
    }

}
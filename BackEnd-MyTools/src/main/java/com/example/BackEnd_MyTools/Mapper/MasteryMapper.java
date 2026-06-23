package com.example.BackEnd_MyTools.Mapper;

import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.DTO.DtoGetMastery;

import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MasteryMapper {

    @Mapping(target = "photoUrls", ignore = true)

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
                            .map(id -> baseUrl + "/masterys/photos/" + id)
                            .toList());
        }
    }
}
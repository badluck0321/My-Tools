package com.example.BackEnd_MyTools.Mapper;

import com.example.BackEnd_MyTools.Entitys.VendorVerification;
import com.example.BackEnd_MyTools.DTO.DtoGetVendorVerification;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface VendorVerificationMapper {

    @Mapping(target = "photoUrl", ignore = true)

    DtoGetVendorVerification toDto(VendorVerification vendorVerification, @Context String baseUrl);

    List<DtoGetVendorVerification> toDtoList(List<VendorVerification> vendorVerifications, @Context String baseUrl);

    @AfterMapping
    default void mapPhotos(VendorVerification vendorVerification,
            @MappingTarget DtoGetVendorVerification dto,
            @Context String baseUrl) {

        if (vendorVerification.getPhotoUrl() != null) {
            dto.setPhotoUrl(mapPhotoRef(vendorVerification.getPhotoUrl(), baseUrl, "vendor-verifications"));
        }
    }

    default String mapPhotoRef(String ref, String baseUrl, String endpoint) {
        if (ref == null || ref.isBlank())
            return ref;
        if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("data:"))
            return ref;
        return baseUrl + "/" + endpoint + "/photos/" + ref;
    }

}
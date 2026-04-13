package com.example.BackEnd_MyTools.Mapper;
import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.DTO.GetMasteryDto;
import org.mapstruct.*;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MasteryMapper {
    GetMasteryDto toDto(Mastery mastery);
    
    List<GetMasteryDto> toDtoList(List<Mastery> masterys);
}

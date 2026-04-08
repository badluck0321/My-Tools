package com.example.BackEnd_MyTools.DTO;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
public class GetMasteryDto {
    @Id
    public String id;
    public String title;
    public int typeId;
    public String price;
    public String description;
}

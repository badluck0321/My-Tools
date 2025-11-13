package com.example.BackEnd_MyTools.Entitys;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "LookUps") // MongoDB collection name
@Data
public class Lookups {
    @Id
    public String id;

    public String name;
}

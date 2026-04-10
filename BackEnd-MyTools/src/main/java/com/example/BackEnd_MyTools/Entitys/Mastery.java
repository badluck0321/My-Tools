package com.example.BackEnd_MyTools.Entitys;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "Service") // MongoDB collection name
@Data
public class Mastery {
    @Id
    public String id;
    public String title;
    public int typeId;
    public int price;
    public String description;
}

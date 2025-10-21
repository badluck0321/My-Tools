package com.example.MyTools.Entitys;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "Demande") // MongoDB collection name

public class Demande {
    public int id;
    public String title;
    public int typeId;   
    public String price;
    public String description;
}

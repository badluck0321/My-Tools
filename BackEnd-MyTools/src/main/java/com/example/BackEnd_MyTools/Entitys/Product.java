package com.example.BackEnd_MyTools.Entitys;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "Product") // MongoDB collection name
public class Product {
    @Id
    public String id;

    public String name;
    public int categoryId;
    public int markId;
    public int serieNum;
    public String description;
    public String price;
    public int listedFor;
    public int duration;
    private List<String> photoIds;
    public boolean isavailable;
}

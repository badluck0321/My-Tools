package com.example.MyTools.Entitys;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "Product") // MongoDB collection name
public class Product {
    public int id;
    public String name;
    public int categoryId;   
    public int markId;
    public int serieNum;
    public String description;
    public String price;
    public int listedFor;
    public int duration;
    public boolean isavailable;
}

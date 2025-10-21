package com.example.BackEnd_MyTools.Entitys;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "Demande") // MongoDB collection name
@Data
public class Demande {
    public int id;
    public String title;
    public int typeId;   
    public String price;
    public String description;
}

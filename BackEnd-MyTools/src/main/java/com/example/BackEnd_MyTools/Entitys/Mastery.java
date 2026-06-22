package com.example.BackEnd_MyTools.Entitys;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "Mastery") // MongoDB collection name
@Data
public class Mastery {
    @Id
    public String id;

    public String masterId;
    public String masterName;
    public String masterPhone;
    public String title;
    public int masteryTypeId;
    public String masteryStatuId;
    public String pricingType;
    public int price;
    public String city;
    public int experienceYears;
    public String description;
    public List<String> photoUrls;
}

package com.example.BackEnd_MyTools.DTO;

import java.util.List;

import org.springframework.data.annotation.Id;
import lombok.Data;

@Data
public class DtoGetMastery {
    @Id
    public String id;
    public String masterId;
    public String masterName; // Added
    public String masterPhone; // Added
    public String title;
    public int typeId;
    public int price;
    public String description;
    public String city; // Added
    public int experienceYears; // Added
    public String masteryStatuId; // Added
    public String pricingType; // Added
    public List<String> photoUrls;
}

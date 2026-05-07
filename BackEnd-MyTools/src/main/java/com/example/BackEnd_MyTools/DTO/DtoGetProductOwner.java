package com.example.BackEnd_MyTools.DTO;

import java.util.List;
import lombok.Data;

@Data
public class DtoGetProductOwner {
    private String id;
    private String name;
    private int categoryId;
    private int markId;
    private int serieNum;
    private String description;
    private int price;
    private int listedForId;
    private String ownerId;
    private int duration;
    private boolean isavailable;
    private List<String> photoUrls;
}
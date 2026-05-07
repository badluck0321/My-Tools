package com.example.BackEnd_MyTools.DTO;

import java.util.List;

import lombok.Data;
@Data

public class DtoCreateProduct {
    public String name;
    public int categoryId;
    public int markId;
    public int serieNum;
    public String description;
    public int price;
    public int listedForId;
    public int duration;
    private List<String> photoUrls;
    public boolean isavailable;
}

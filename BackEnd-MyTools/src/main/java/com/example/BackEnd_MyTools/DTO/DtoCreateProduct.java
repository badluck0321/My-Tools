package com.example.BackEnd_MyTools.DTO;

import java.util.List;

import lombok.Data;

public class DtoCreateProduct {
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

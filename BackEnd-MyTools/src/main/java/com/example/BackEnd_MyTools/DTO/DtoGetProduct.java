package com.example.BackEnd_MyTools.DTO;

import java.util.List;
import lombok.Data;

@Data
public class DtoGetProduct {
    private String id;
    private String name;
    private int categoryId;
    private int markId;
    private int serieNum;
    private String description;
    private String price;
    private int listedFor;
    private int duration;
    private boolean isavailable;
    private List<String> photoIds;
}
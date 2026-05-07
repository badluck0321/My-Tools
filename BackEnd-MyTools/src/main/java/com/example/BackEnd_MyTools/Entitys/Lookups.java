package com.example.BackEnd_MyTools.Entitys;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "lookup")
public class Lookups {

    @Id
    private String id;

    private String type;   // e.g. CONDITION, PRICING_TYPE
    private String code;   // e.g. NEW, USED
    private String value;  // e.g. "New", "Used"

    private boolean isActive = true;
}
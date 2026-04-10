package com.example.BackEnd_MyTools.Specifications;

import org.springframework.data.mongodb.core.query.Criteria;

public class MasterySpecs {
    public static Criteria hasTitleLike(String title) {
        return title != null ? Criteria.where("title").regex(".*" + title + ".*", "i") : null;
    }

    public static Criteria hasTypeId(Integer typeId) {
        return typeId != null ? Criteria.where("typeId").is(typeId) : null;
    }
    public static Criteria hasPriceBetween(Integer minPrice, Integer maxPrice) {
        if (minPrice != null && maxPrice != null) {
            return Criteria.where("price").gte(minPrice).lte(maxPrice);
        } else if (minPrice != null) {
            return Criteria.where("price").gte(minPrice);
        } else if (maxPrice != null) {
            return Criteria.where("price").lte(maxPrice);
        } else {
            return null;
        }
    }


}

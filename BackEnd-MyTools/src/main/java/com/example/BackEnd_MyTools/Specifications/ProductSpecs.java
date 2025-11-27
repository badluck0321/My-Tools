package com.example.BackEnd_MyTools.Specifications;

import org.springframework.data.mongodb.core.query.Criteria;

public class ProductSpecs {
    public static Criteria hasNameLike(String name) {
        return name != null ? Criteria.where("name").regex(".*" + name + ".*", "i") : null;
    }

    public static Criteria hasCategoryId(Integer categoryId) {
        // return categoryId != null ? Criteria.where("categoryId").is(categoryId) :
        // null;
        return categoryId != null ? Criteria.where("categoryId").is(categoryId) : null;
    }

    public static Criteria hasMarkId(Integer markId) {
        return markId != null ? Criteria.where("markId").is(markId) : null;
    }

    public static Criteria isAvailable(Boolean isAvailable) {
        return isAvailable != null ? Criteria.where("isavailable").is(isAvailable) : null;
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

    public static Criteria hasDuration(Integer duration) {
        return duration != null ? Criteria.where("duration").is(duration) : null;
    }

    public static Criteria hasListedFor(Integer listedFor) {
        return listedFor != null ? Criteria.where("listedFor").is(listedFor) : null;
    }

}

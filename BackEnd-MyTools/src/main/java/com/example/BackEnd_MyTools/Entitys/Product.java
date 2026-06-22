package com.example.BackEnd_MyTools.Entitys;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Product")
@Data
public class Product {
    @Id
    public String id;

    public String name;
    public int categoryId;
    public int markId;
    public int serieNum;
    public String description;
    public int price;
    public List<String> tags;
    public String ownerId;
    public int conditionId;
    public int listedForId;
    public String currencyId;
    public int duration;
    public List<String> photoUrls;
    public boolean isavailable;
    public Instant createdAt;
    public Instant updatedAt;

    // Geolocation listing support
    public String city;
    public Double latitude;
    public Double longitude;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    public GeoJsonPoint location;

    // Moderation/admin panel support
    public boolean hidden;
    public String moderationStatus;
}

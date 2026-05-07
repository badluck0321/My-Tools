package com.example.BackEnd_MyTools.Entitys;
import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "Store")
@Data

public class Store {
    @Id
    public String id;
   
   public String name;
   public String email;
   public String phone;
   public String logo;
   public String address;
   public Boolean isActive = true;
   public Boolean isVerified = false;
   public boolean isDeliveryAvailable;
   public Instant createdAt;
   public List<String> ownerId;
   public List<String> associatsIds;
   public List<String> socialMedias;

}

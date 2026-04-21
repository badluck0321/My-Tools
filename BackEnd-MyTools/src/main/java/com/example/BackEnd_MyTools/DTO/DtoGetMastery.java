package com.example.BackEnd_MyTools.DTO;
import org.springframework.data.annotation.Id;
import lombok.Data;

@Data
public class DtoGetMastery {
    @Id
    public String id;
    public String masterId;
    public String title;
    public int typeId;
    public int price;
    public String description;
    public String photoId;

}

package com.example.BackEnd_MyTools.DTO;
import java.time.LocalDate;
import com.example.BackEnd_MyTools.Entitys.Cart;
import lombok.Data;

@Data
public class AddToCartRequest {
    private String productId;
    private Cart.CartItem.ListingType listingType;
    private LocalDate startDate;  // null for SALE
    private LocalDate endDate;    // null for SALE
}
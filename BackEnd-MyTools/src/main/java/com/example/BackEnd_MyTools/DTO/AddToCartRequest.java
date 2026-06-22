package com.example.BackEnd_MyTools.DTO;

import java.time.LocalDate;

import com.example.BackEnd_MyTools.Entitys.Cart;
import lombok.Data;

@Data
public class AddToCartRequest {
    private String productId;
    private Cart.CartItem.ListingType listingType = Cart.CartItem.ListingType.SALE;
    private int quantity = 1;
    private LocalDate startDate;
    private LocalDate endDate;
}

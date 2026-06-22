package com.example.BackEnd_MyTools.DTO;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String shippingAddress;
    private String note;
}

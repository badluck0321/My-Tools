package com.example.BackEnd_MyTools.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentCheckoutResponse {
    private String paymentId;
    private String provider;
    private String status;
    private String checkoutUrl;
}

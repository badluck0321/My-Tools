package com.example.BackEnd_MyTools.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.DTO.PaymentCheckoutResponse;
import com.example.BackEnd_MyTools.Entitys.Payment;
import com.example.BackEnd_MyTools.Services.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/checkout/{orderId}")
    public ResponseEntity<PaymentCheckoutResponse> createCheckout(@PathVariable String orderId, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(paymentService.createCheckout(orderId, jwt));
    }

    @PostMapping("/{paymentId}/confirm")
    public ResponseEntity<Payment> confirm(@PathVariable String paymentId, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(paymentService.confirm(paymentId, jwt));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<Payment> refund(@PathVariable String paymentId, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(paymentService.refund(paymentId, jwt));
    }
}

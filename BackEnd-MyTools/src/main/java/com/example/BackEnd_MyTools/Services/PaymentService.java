package com.example.BackEnd_MyTools.Services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.PaymentCheckoutResponse;
import com.example.BackEnd_MyTools.Entitys.Order;
import com.example.BackEnd_MyTools.Entitys.Payment;
import com.example.BackEnd_MyTools.Repositories.OrderRepo;
import com.example.BackEnd_MyTools.Repositories.PaymentRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepo paymentRepo;
    private final OrderRepo orderRepo;
    private final NotificationService notificationService;

    @Value("${mytools.payment.provider:mock}")
    private String provider;

    public PaymentCheckoutResponse createCheckout(String orderId, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!userId.equals(order.getBuyerId())) {
            throw new SecurityException("You can only pay your own orders");
        }
        Payment payment = Payment.builder()
            .orderId(orderId)
            .userId(userId)
            .provider(provider)
            .providerSessionId("mock_" + UUID.randomUUID())
            .status(Payment.PaymentStatus.PENDING)
            .amount(order.getTotalAmount())
            .currency("MAD")
            .checkoutUrl("/payments/mock/checkout/" + orderId)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        Payment saved = paymentRepo.save(payment);
        return new PaymentCheckoutResponse(saved.getId(), saved.getProvider(), saved.getStatus().name(), saved.getCheckoutUrl());
    }

    public Payment confirm(String paymentId, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        Payment payment = paymentRepo.findById(paymentId).orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        if (!SecurityUtils.isAdmin(jwt) && !userId.equals(payment.getUserId())) {
            throw new SecurityException("You cannot confirm this payment");
        }
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment saved = paymentRepo.save(payment);
        Order order = orderRepo.findById(payment.getOrderId()).orElseThrow();
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepo.save(order);
        notificationService.create(order.getBuyerId(), "PAYMENT_CONFIRMED", "Payment confirmed", "Payment for order " + order.getInvoiceNumber() + " was confirmed.", order.getId());
        return saved;
    }

    public Payment refund(String paymentId, Jwt jwt) {
        if (!SecurityUtils.isAdmin(jwt)) throw new SecurityException("Admin role required");
        Payment payment = paymentRepo.findById(paymentId).orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepo.save(payment);
    }
}

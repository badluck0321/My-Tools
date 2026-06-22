package com.example.BackEnd_MyTools.Controllers;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.DTO.CheckoutRequest;
import com.example.BackEnd_MyTools.DTO.UpdateOrderStatusRequest;
import com.example.BackEnd_MyTools.Entitys.Order;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.InvoiceService;
import com.example.BackEnd_MyTools.Services.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final InvoiceService invoiceService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestBody(required = false) CheckoutRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orderService.checkout(jwt, request == null ? new CheckoutRequest() : request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> myOrders(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orderService.myOrders(SecurityUtils.currentUserId(jwt)));
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Order>> sellerOrders(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orderService.sellerOrders(SecurityUtils.currentUserId(jwt)));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Order>> allOrders(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orderService.allOrders(jwt));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orderService.getAccessibleOrder(id, jwt));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestBody UpdateOrderStatusRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus(), jwt));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> invoice(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        Order order = orderService.getAccessibleOrder(id, jwt);
        byte[] pdf = invoiceService.generateInvoicePdf(order);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice-" + order.getInvoiceNumber() + ".pdf")
            .body(pdf);
    }
}

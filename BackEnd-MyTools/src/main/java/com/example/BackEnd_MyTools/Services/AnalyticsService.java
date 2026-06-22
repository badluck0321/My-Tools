package com.example.BackEnd_MyTools.Services;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Order;
import com.example.BackEnd_MyTools.Repositories.OrderRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.Repositories.ReviewRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final ReviewRepo reviewRepo;

    public Map<String, Object> dashboard(Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        List<Order> orders = SecurityUtils.isAdmin(jwt) ? orderRepo.findAll() : orderRepo.findSellerOrders(userId);
        double revenue = orders.stream()
            .filter(o -> o.getStatus() != Order.OrderStatus.CANCELLED)
            .mapToDouble(Order::getTotalAmount)
            .sum();
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("orders", orders.size());
        data.put("revenue", revenue);
        data.put("products", SecurityUtils.isAdmin(jwt) ? productRepo.count() : productRepo.findByOwnerIdOrderByCreatedAtDesc(userId).size());
        data.put("reviews", reviewRepo.count());
        return data;
    }

    public byte[] ordersCsv(Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        List<Order> orders = SecurityUtils.isAdmin(jwt) ? orderRepo.findAll() : orderRepo.findSellerOrders(userId);
        StringBuilder csv = new StringBuilder("id,invoice,status,total,createdAt\n");
        for (Order order : orders) {
            csv.append(order.getId()).append(',')
               .append(order.getInvoiceNumber()).append(',')
               .append(order.getStatus()).append(',')
               .append(order.getTotalAmount()).append(',')
               .append(order.getCreatedAt()).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }
}

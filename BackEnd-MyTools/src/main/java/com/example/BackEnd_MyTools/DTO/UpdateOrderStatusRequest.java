package com.example.BackEnd_MyTools.DTO;

import com.example.BackEnd_MyTools.Entitys.Order;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private Order.OrderStatus status;
}

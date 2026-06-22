package com.example.BackEnd_MyTools.Repositories;

import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Order;

@Repository
public interface OrderRepo extends MongoRepository<Order, String> {
    List<Order> findByBuyerIdOrderByCreatedAtDesc(String buyerId);

    @Query("{ 'items.ownerId': ?0 }")
    List<Order> findSellerOrders(String ownerId);

    List<Order> findByBuyerIdAndStatusIn(String buyerId, Collection<Order.OrderStatus> statuses);
}

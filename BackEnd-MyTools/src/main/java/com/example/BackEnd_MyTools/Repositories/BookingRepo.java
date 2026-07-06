package com.example.BackEnd_MyTools.Repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.BackEnd_MyTools.Entitys.Booking;

@Repository
public interface BookingRepo extends MongoRepository<Booking, String> {
    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByProductIdOrderByStartDateAsc(String productId);

    List<Booking> findByResourceTypeAndResourceIdOrderByStartDateAsc(Booking.ResourceType resourceType,
            String resourceId);

    List<Booking> findByOwnerIdOrderByCreatedAtDesc(String ownerId);

    @Query("{ 'productId': ?0, 'status': { $in: ['PENDING', 'CONFIRMED'] }, 'startDate': { $lt: ?2 }, 'endDate': { $gt: ?1 } }")
    List<Booking> findConflictingBookings(String productId, LocalDate startDate, LocalDate endDate);

    @Query("{ 'resourceType': ?0, 'resourceId': ?1, 'status': { $in: ['PENDING', 'CONFIRMED'] }, 'startDate': { $lt: ?3 }, 'endDate': { $gt: ?2 } }")
    List<Booking> findConflictingResourceBookings(Booking.ResourceType resourceType, String resourceId,
            LocalDate startDate, LocalDate endDate);
}

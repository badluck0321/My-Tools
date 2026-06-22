package com.example.BackEnd_MyTools.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.DTO.CreateBookingRequest;
import com.example.BackEnd_MyTools.Entitys.Booking;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.BookingRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepo bookingRepo;
    private final ProductRepo productRepo;
    private final NotificationService notificationService;

    public List<Booking> getMyBookings(String userId) {
        return bookingRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Booking> getProductBookings(String productId) {
        return bookingRepo.findByProductIdOrderByStartDateAsc(productId);
    }

    public boolean hasConflict(String productId, LocalDate startDate, LocalDate endDate) {
        validateDates(startDate, endDate);
        return !bookingRepo.findConflictingBookings(productId, startDate, endDate).isEmpty();
    }

    public Booking createDirectBooking(Jwt jwt, CreateBookingRequest request) {
        String userId = SecurityUtils.currentUserId(jwt);
        Product product = productRepo.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        validateDates(request.getStartDate(), request.getEndDate());
        if (hasConflict(product.getId(), request.getStartDate(), request.getEndDate())) {
            throw new IllegalArgumentException("Product is already booked for the selected dates");
        }
        Booking booking = buildBooking(product, userId, null, request.getStartDate(), request.getEndDate(), Math.max(1, request.getQuantity()), Booking.BookingStatus.PENDING);
        Booking saved = bookingRepo.save(booking);
        if (product.getOwnerId() != null && !product.getOwnerId().equals(userId)) {
            notificationService.create(product.getOwnerId(), "BOOKING_REQUEST", "New rental booking", "A customer requested a rental booking for " + product.getName(), saved.getId());
        }
        return saved;
    }

    public Booking createFromOrderItem(Product product, String userId, String orderId, Cart.CartItem item, Booking.BookingStatus status) {
        validateDates(item.getStartDate(), item.getEndDate());
        if (hasConflict(product.getId(), item.getStartDate(), item.getEndDate())) {
            throw new IllegalArgumentException("Product " + product.getName() + " is already booked for the selected dates");
        }
        return bookingRepo.save(buildBooking(product, userId, orderId, item.getStartDate(), item.getEndDate(), item.getQuantity(), status));
    }

    public Booking updateStatus(String bookingId, Booking.BookingStatus status, Jwt jwt) {
        String userId = SecurityUtils.currentUserId(jwt);
        Booking booking = bookingRepo.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        boolean owner = userId.equals(booking.getOwnerId());
        boolean customer = userId.equals(booking.getUserId());
        if (!SecurityUtils.isAdmin(jwt) && !owner && !(customer && status == Booking.BookingStatus.CANCELLED)) {
            throw new SecurityException("You are not allowed to update this booking");
        }
        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepo.save(booking);
    }

    private Booking buildBooking(Product product, String userId, String orderId, LocalDate startDate, LocalDate endDate, int quantity, Booking.BookingStatus status) {
        long days = Math.max(1, ChronoUnit.DAYS.between(startDate, endDate));
        return Booking.builder()
            .productId(product.getId())
            .productName(product.getName())
            .ownerId(product.getOwnerId())
            .userId(userId)
            .orderId(orderId)
            .startDate(startDate)
            .endDate(endDate)
            .quantity(Math.max(1, quantity))
            .dailyPrice(product.getPrice())
            .durationDays(days)
            .totalPrice(days * Math.max(1, quantity) * product.getPrice())
            .status(status)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start and end date are required");
        }
        if (startDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }
        if (!endDate.isAfter(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }
    }
}

package com.example.BackEnd_MyTools.Controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.example.BackEnd_MyTools.DTO.CreateBookingRequest;
import com.example.BackEnd_MyTools.Entitys.Booking;
import com.example.BackEnd_MyTools.Security.SecurityUtils;
import com.example.BackEnd_MyTools.Services.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> myBookings(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookingService.getMyBookings(SecurityUtils.currentUserId(jwt)));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Booking>> productBookings(@PathVariable String productId) {
        return ResponseEntity.ok(bookingService.getProductBookings(productId));
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> availability(@RequestParam String productId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        boolean conflict = bookingService.hasConflict(productId, startDate, endDate);
        return ResponseEntity.ok(Map.of("available", !conflict, "conflict", conflict));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody CreateBookingRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookingService.createDirectBooking(jwt, request));
    }

    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<Booking> updateStatus(@PathVariable String id, @PathVariable Booking.BookingStatus status, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status, jwt));
    }
}

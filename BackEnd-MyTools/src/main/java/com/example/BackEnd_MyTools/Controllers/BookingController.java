package com.example.BackEnd_MyTools.Controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/mastery/{masteryId}")
    public ResponseEntity<List<Booking>> masteryBookings(@PathVariable String masteryId) {
        return ResponseEntity.ok(bookingService.getMasteryBookings(masteryId));
    }

    @GetMapping("/resource/{resourceType}/{resourceId}")
    public ResponseEntity<List<Booking>> resourceBookings(@PathVariable Booking.ResourceType resourceType,
            @PathVariable String resourceId) {
        return ResponseEntity.ok(bookingService.getResourceBookings(resourceType, resourceId));
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> availability(
            @RequestParam(required = false) Booking.ResourceType resourceType,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String productId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        Booking.ResourceType type = resourceType == null ? Booking.ResourceType.PRODUCT : resourceType;
        String id = resourceId != null ? resourceId : productId;
        boolean conflict = bookingService.hasConflict(type, id, startDate, endDate);
        return ResponseEntity.ok(Map.of("available", !conflict, "conflict", conflict, "resourceType", type.name(), "resourceId", id));
    }

    @GetMapping("/unavailable-dates")
    public ResponseEntity<Map<String, Object>> unavailableDates(
            @RequestParam Booking.ResourceType resourceType,
            @RequestParam String resourceId) {
        List<LocalDate> dates = bookingService.getUnavailableDates(resourceType, resourceId);
        return ResponseEntity.ok(Map.of("resourceType", resourceType.name(), "resourceId", resourceId, "dates", dates));
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

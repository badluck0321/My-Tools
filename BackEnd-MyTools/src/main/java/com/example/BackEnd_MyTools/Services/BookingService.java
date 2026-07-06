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
import com.example.BackEnd_MyTools.Entitys.Mastery;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.BookingRepo;
import com.example.BackEnd_MyTools.Repositories.MasteryRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.Security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepo bookingRepo;
    private final ProductRepo productRepo;
    private final MasteryRepo masteryRepo;
    private final NotificationService notificationService;

    public List<Booking> getMyBookings(String userId) {
        return bookingRepo.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::normalizeBooking)
                .toList();
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAllByOrderByCreatedAtDesc().stream()
                .map(this::normalizeBooking)
                .toList();
    }

    public List<Booking> getProductBookings(String productId) {
        return bookingRepo.findByProductIdOrderByStartDateAsc(productId).stream()
                .map(this::normalizeBooking)
                .toList();
    }

    public List<Booking> getMasteryBookings(String masteryId) {
        return getResourceBookings(Booking.ResourceType.MASTERY, masteryId);
    }

    public List<Booking> getResourceBookings(Booking.ResourceType resourceType, String resourceId) {
        if (resourceType == Booking.ResourceType.PRODUCT) {
            return getProductBookings(resourceId);
        }
        return bookingRepo.findByResourceTypeAndResourceIdOrderByStartDateAsc(resourceType, resourceId).stream()
                .map(this::normalizeBooking)
                .toList();
    }

    public List<LocalDate> getUnavailableDates(Booking.ResourceType resourceType, String resourceId) {
        return getResourceBookings(resourceType, resourceId).stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.PENDING || b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .flatMap(b -> b.getStartDate().datesUntil(b.getEndDate().plusDays(1)))
                .distinct()
                .sorted()
                .toList();
    }

    public boolean hasConflict(String productId, LocalDate startDate, LocalDate endDate) {
        return hasConflict(Booking.ResourceType.PRODUCT, productId, startDate, endDate);
    }

    public boolean hasConflict(Booking.ResourceType resourceType, String resourceId, LocalDate startDate, LocalDate endDate) {
        validateDates(startDate, endDate);
        if (resourceType == Booking.ResourceType.PRODUCT) {
            return !bookingRepo.findConflictingBookings(resourceId, startDate, endDate).isEmpty()
                    || !bookingRepo.findConflictingResourceBookings(resourceType, resourceId, startDate, endDate).isEmpty();
        }
        return !bookingRepo.findConflictingResourceBookings(resourceType, resourceId, startDate, endDate).isEmpty();
    }

    public Booking createDirectBooking(Jwt jwt, CreateBookingRequest request) {
        String userId = SecurityUtils.currentUserId(jwt);
        Booking.ResourceType type = resolveType(request);
        String resourceId = resolveResourceId(request, type);
        validateDates(request.getStartDate(), request.getEndDate());
        if (hasConflict(type, resourceId, request.getStartDate(), request.getEndDate())) {
            throw new IllegalArgumentException(resourceLabel(type) + " is already booked for the selected dates");
        }

        Booking booking = type == Booking.ResourceType.PRODUCT
                ? buildBooking(loadProduct(resourceId), userId, null, request.getStartDate(), request.getEndDate(), Math.max(1, request.getQuantity()), Booking.BookingStatus.PENDING)
                : buildBooking(loadMastery(resourceId), userId, null, request.getStartDate(), request.getEndDate(), Math.max(1, request.getQuantity()), Booking.BookingStatus.PENDING);

        Booking saved = bookingRepo.save(booking);
        notifyOwner(saved, userId);
        return saved;
    }

    public Booking createFromOrderItem(Product product, String userId, String orderId, Cart.CartItem item, Booking.BookingStatus status) {
        validateDates(item.getStartDate(), item.getEndDate());
        if (hasConflict(Booking.ResourceType.PRODUCT, product.getId(), item.getStartDate(), item.getEndDate())) {
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
        return bookingRepo.save(normalizeBooking(booking));
    }

    private Product loadProduct(String productId) {
        return productRepo.findById(productId).orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private Mastery loadMastery(String masteryId) {
        return masteryRepo.findById(masteryId).orElseThrow(() -> new IllegalArgumentException("Mastery not found"));
    }

    private Booking buildBooking(Product product, String userId, String orderId, LocalDate startDate, LocalDate endDate, int quantity, Booking.BookingStatus status) {
        long days = Math.max(1, ChronoUnit.DAYS.between(startDate, endDate));
        return Booking.builder()
            .resourceType(Booking.ResourceType.PRODUCT)
            .resourceId(product.getId())
            .resourceName(product.getName())
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

    private Booking buildBooking(Mastery mastery, String userId, String orderId, LocalDate startDate, LocalDate endDate, int quantity, Booking.BookingStatus status) {
        long days = Math.max(1, ChronoUnit.DAYS.between(startDate, endDate));
        return Booking.builder()
            .resourceType(Booking.ResourceType.MASTERY)
            .resourceId(mastery.getId())
            .resourceName(mastery.getTitle())
            .masteryId(mastery.getId())
            .productName(mastery.getTitle())
            .ownerId(mastery.getMasterId())
            .userId(userId)
            .orderId(orderId)
            .startDate(startDate)
            .endDate(endDate)
            .quantity(Math.max(1, quantity))
            .dailyPrice(mastery.getPrice())
            .durationDays(days)
            .totalPrice(days * Math.max(1, quantity) * mastery.getPrice())
            .status(status)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }

    private Booking normalizeBooking(Booking booking) {
        if (booking.getResourceType() == null) {
            booking.setResourceType(booking.getMasteryId() != null ? Booking.ResourceType.MASTERY : Booking.ResourceType.PRODUCT);
        }
        if (booking.getResourceId() == null || booking.getResourceId().isBlank()) {
            booking.setResourceId(booking.getResourceType() == Booking.ResourceType.MASTERY ? booking.getMasteryId() : booking.getProductId());
        }
        if (booking.getResourceName() == null || booking.getResourceName().isBlank()) {
            booking.setResourceName(booking.getProductName());
        }
        return booking;
    }

    private Booking.ResourceType resolveType(CreateBookingRequest request) {
        if (request.getResourceType() != null) {
            return request.getResourceType();
        }
        if (request.getMasteryId() != null && !request.getMasteryId().isBlank()) {
            return Booking.ResourceType.MASTERY;
        }
        return Booking.ResourceType.PRODUCT;
    }

    private String resolveResourceId(CreateBookingRequest request, Booking.ResourceType type) {
        String resourceId = request.getResourceId();
        if (resourceId == null || resourceId.isBlank()) {
            resourceId = type == Booking.ResourceType.MASTERY ? request.getMasteryId() : request.getProductId();
        }
        if (resourceId == null || resourceId.isBlank()) {
            throw new IllegalArgumentException(resourceLabel(type) + " ID is required");
        }
        return resourceId;
    }

    private String resourceLabel(Booking.ResourceType type) {
        return type == Booking.ResourceType.MASTERY ? "Mastery" : "Product";
    }

    private void notifyOwner(Booking booking, String userId) {
        if (booking.getOwnerId() != null && !booking.getOwnerId().equals(userId)) {
            notificationService.create(booking.getOwnerId(), "BOOKING_REQUEST", "New booking request",
                    "A customer requested a booking for " + booking.getResourceName(), booking.getId());
        }
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

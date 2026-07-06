package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.DTO.CreateBookingRequest;
import com.example.BackEnd_MyTools.Entitys.Booking;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Repositories.BookingRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import com.example.BackEnd_MyTools.testsupport.JwtTestFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock
    BookingRepo bookingRepo;
    @Mock
    ProductRepo productRepo;
    @Mock
    NotificationService notificationService;
    @InjectMocks
    BookingService bookingService;

    @Test
    void createDirectBookingCalculatesDurationAndTotal() {
        Product p = product("P001", "Hammer drill", "OWNER", 200);
        CreateBookingRequest r = new CreateBookingRequest();
        r.setProductId("P001");
        r.setQuantity(2);
        r.setStartDate(LocalDate.now().plusDays(2));
        r.setEndDate(LocalDate.now().plusDays(5));
        when(productRepo.findById("P001")).thenReturn(Optional.of(p));
        when(bookingRepo.findConflictingBookings("P001", r.getStartDate(), r.getEndDate())).thenReturn(List.of());
        when(bookingRepo.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));
        Booking b = bookingService.createDirectBooking(JwtTestFactory.user("CUSTOMER"), r);
        assertThat(b.getDurationDays()).isEqualTo(3);
        assertThat(b.getTotalPrice()).isEqualTo(1200);
    }

    @Test
    void createDirectBookingRejectsConflictingDates() {
        Product p = product("P001", "Hammer drill", "OWNER", 200);
        CreateBookingRequest r = new CreateBookingRequest();
        r.setProductId("P001");
        r.setStartDate(LocalDate.now().plusDays(2));
        r.setEndDate(LocalDate.now().plusDays(5));
        when(productRepo.findById("P001")).thenReturn(Optional.of(p));
        when(bookingRepo.findConflictingBookings("P001", r.getStartDate(), r.getEndDate()))
                .thenReturn(List.of(Booking.builder().id("B001").build()));
        assertThatThrownBy(() -> bookingService.createDirectBooking(JwtTestFactory.user("CUSTOMER"), r))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("already booked");
    }

    @Test
    void getAllBookingsReturnsAllBookings() {
        Booking first = Booking.builder().id("B001").build();
        Booking second = Booking.builder().id("B002").build();
        when(bookingRepo.findAll()).thenReturn(List.of(first, second));

        List<Booking> result = bookingService.getAllBookings();

        assertThat(result).extracting(Booking::getId).containsExactly("B001", "B002");
    }

    private Product product(String id, String name, String owner, int price) {
        Product p = new Product();
        p.setId(id);
        p.setName(name);
        p.setOwnerId(owner);
        p.setPrice(price);
        return p;
    }
}

package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Booking;
import com.example.demo.service.BookingService;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            @RequestParam Long userId,
            @RequestParam Long mentorId,
            @RequestParam Long slotId,
            Authentication authentication) {

        System.out.println("=== Booking API called ===");
        String userEmail = authentication != null ? authentication.getName() : null;
        try {
            Booking booking = bookingService.createBooking(userId, mentorId, slotId, userEmail);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Booking failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Booking failed: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }

    @GetMapping("/mentor/{mentorId}")
    public List<Booking> getMentorBookings(@PathVariable Long mentorId) {
        return bookingService.getMentorBookings(mentorId);
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/status/{bookingId}")
    public Booking updateStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {
        return bookingService.updateStatus(bookingId, status);
    }
}

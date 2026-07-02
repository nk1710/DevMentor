package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Booking;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BookingService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            Authentication auth,
            @RequestBody Map<String, Long> request) {

        Long mentorId = request.get("mentorId");
        Long slotId = request.get("slotId");

        if (mentorId == null || slotId == null) {
            return ResponseEntity.badRequest().body("mentorId and slotId are required");
        }

        if (auth == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        Booking booking = bookingService.createBooking(user.getId(), mentorId, slotId);

        if (booking == null) {
            return ResponseEntity.status(400)
                .body("Booking failed — slot already booked or invalid IDs");
        }
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserBookings(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        String email = auth.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<?> getMentorBookings(
            @PathVariable Long mentorId,
            Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        return ResponseEntity.ok(bookingService.getMentorBookings(mentorId));
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/status/{bookingId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {
        Booking updated = bookingService.updateStatus(bookingId, status);
        if (updated == null) return ResponseEntity.badRequest().body("Booking not found");
        return ResponseEntity.ok(updated);
    }
}
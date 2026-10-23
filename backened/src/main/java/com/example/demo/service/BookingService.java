package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorRepository mentorRepository;

    public synchronized Booking createBooking(Long userId, Long mentorId, Long slotId) {
        return createBooking(userId, mentorId, slotId, null);
    }

    public synchronized Booking createBooking(Long userId, Long mentorId, Long slotId, String userEmail) {
        System.out.println("=== Creating booking ===");
        System.out.println("userId=" + userId + " mentorId=" + mentorId + " slotId=" + slotId + " userEmail=" + userEmail);

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        if (user == null && userEmail != null && !userEmail.trim().isEmpty()) {
            user = userRepository.findByEmail(userEmail.trim());
        }

        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
        Slot slot = slotRepository.findById(slotId).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found (ID: " + userId + ")");
        }
        if (mentor == null) {
            throw new IllegalArgumentException("Mentor not found (ID: " + mentorId + ")");
        }
        if (slot == null) {
            throw new IllegalArgumentException("Slot not found (ID: " + slotId + ")");
        }

        // Idempotency: if already booked by this user, return the existing booking!
        if (slot.isBooked()) {
            Optional<Booking> existing = bookingRepository.findBySlotId(slotId);
            if (existing.isPresent()) {
                Booking b = existing.get();
                if (b.getUser() != null && (b.getUser().getId().equals(user.getId()) || (user.getEmail() != null && user.getEmail().equalsIgnoreCase(b.getUser().getEmail())))) {
                    System.out.println("Booking already exists for this user and slot, returning existing booking id=" + b.getId());
                    return b;
                }
            }
            throw new IllegalStateException("Slot is already booked by another user");
        }

        // Book slot
        slot.setBooked(true);
        slotRepository.save(slot);

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setMentor(mentor);
        booking.setSlot(slot);
        booking.setStatus("CONFIRMED");
        booking.setRoomId("devmentor-" + user.getId() + "-" + mentorId + "-" + slotId + "-" + System.currentTimeMillis());

        Booking saved = bookingRepository.save(booking);
        System.out.println("=== Booking saved id=" + saved.getId() + " roomId=" + saved.getRoomId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getMentorBookings(Long mentorId) {
        return bookingRepository.findByMentorId(mentorId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return null;
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}

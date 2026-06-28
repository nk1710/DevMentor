package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorRepository mentorRepository;

    public Booking createBooking(Long userId, Long mentorId, Long slotId) {
        System.out.println("=== Creating booking ===");
        System.out.println("userId=" + userId + " mentorId=" + mentorId + " slotId=" + slotId);

        User user = userRepository.findById(userId).orElse(null);
        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
        Slot slot = slotRepository.findById(slotId).orElse(null);

        if (user == null) { System.out.println("USER NOT FOUND"); return null; }
        if (mentor == null) { System.out.println("MENTOR NOT FOUND"); return null; }
        if (slot == null) { System.out.println("SLOT NOT FOUND"); return null; }
        if (slot.isBooked()) { System.out.println("SLOT ALREADY BOOKED"); return null; }

        // Slot book karo
        slot.setBooked(true);
        slotRepository.save(slot);

        // Booking banao
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setMentor(mentor);
        booking.setSlot(slot);
        booking.setStatus("CONFIRMED");
        booking.setRoomId("devmentor-" + userId + "-" + mentorId + "-" + slotId);

        Booking saved = bookingRepository.save(booking);
        System.out.println("=== Booking saved id=" + saved.getId() +
            " roomId=" + saved.getRoomId());
        return saved;
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getMentorBookings(Long mentorId) {
        return bookingRepository.findByMentorId(mentorId);
    }

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
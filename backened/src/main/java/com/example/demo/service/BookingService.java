package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import java.util.List;
import java.util.UUID;

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

    @Autowired
    private CollegeSessionRepository collegeSessionRepository;

    @Transactional
    public Booking createBooking(Long userId, Long mentorId, Long slotId) {
        User user = userRepository.findById(userId).orElse(null);
        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
        Slot slot = slotRepository.findById(slotId).orElse(null);

        if (user == null) throw new IllegalArgumentException("User not found");
        if (mentor == null) throw new IllegalArgumentException("Mentor not found");
        if (slot == null) throw new IllegalArgumentException("Slot not found");
        if (slot.isBooked()) throw new IllegalArgumentException("Slot already booked");
        if (!slot.getMentor().getId().equals(mentorId)) {
            throw new IllegalArgumentException("Slot does not belong to this mentor");
        }

        try {
            slot.setBooked(true);
            slotRepository.save(slot);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new IllegalStateException("Slot was just booked by someone else");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setMentor(mentor);
        booking.setSlot(slot);
        booking.setStatus("CONFIRMED");
        booking.setRoomId("dm-" + UUID.randomUUID().toString().substring(0, 12));

        Booking saved = bookingRepository.save(booking);

        mentor.setTotalSessions(
            (mentor.getTotalSessions() == null ? 0 : mentor.getTotalSessions()) + 1
        );
        mentorRepository.save(mentor);

        return bookingRepository.findById(saved.getId()).orElse(saved);
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

    @Transactional
    public Booking updateStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return null;
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}

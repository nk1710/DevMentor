package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.Mentor;
import com.example.demo.entity.Slot;
import com.example.demo.repository.MentorRepository;
import com.example.demo.repository.SlotRepository;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@Transactional
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private MentorRepository mentorRepository;

    public Slot addSlot(Long mentorId, Slot slot) {
        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
        if (mentor == null) {
            throw new IllegalArgumentException("Mentor not found");
        }

        if (slot.getDate() != null) {
            try {
                LocalDate slotDate = LocalDate.parse(slot.getDate());
                if (slotDate.isBefore(LocalDate.now())) {
                    throw new IllegalArgumentException("Cannot create slot for past date");
                }
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
            }
        }

        slot.setMentor(mentor);
        slot.setBooked(false);

        Slot saved = slotRepository.save(slot);
        return saved;
    }

    public List<Slot> getAvailableSlots(Long mentorId) {
        return slotRepository.findByMentorIdAndBooked(mentorId, false);
    }
}
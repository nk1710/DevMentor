package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Mentor;
import com.example.demo.entity.Slot;
import com.example.demo.repository.MentorRepository;
import com.example.demo.repository.SlotRepository;
import java.util.List;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private MentorRepository mentorRepository;

    public Slot addSlot(Long mentorId, Slot slot) {
        System.out.println("=== Adding slot for mentorId: " + mentorId);

        Mentor mentor = mentorRepository.findById(mentorId).orElse(null);

        if (mentor == null) {
            System.out.println("=== ERROR: Mentor not found for id: " + mentorId);
            return null;
        }

        System.out.println("=== Mentor found: " + mentor.getName());
        slot.setMentor(mentor);
        slot.setBooked(false);

        Slot saved = slotRepository.save(slot);
        System.out.println("=== Slot saved with id: " + saved.getId());
        return saved;
    }

    public List<Slot> getAvailableSlots(Long mentorId) {
        return slotRepository.findByMentorIdAndBooked(mentorId, false);
    }
}
package com.example.demo.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Mentor;
import com.example.demo.entity.Slot;
import com.example.demo.repository.MentorRepository;
import com.example.demo.service.SlotService;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @Autowired
    private MentorRepository mentorRepository;

    @PostMapping("/add/{mentorId}")
    public ResponseEntity<?> addSlot(
            Authentication auth,
            @PathVariable Long mentorId,
            @Valid @RequestBody Slot slot) {

        if (auth == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        String email = auth.getName();
        Mentor mentor = mentorRepository.findByEmail(email);
        if (mentor == null || !mentor.getId().equals(mentorId)) {
            return ResponseEntity.status(403).body("Access denied");
        }

        try {
            Slot saved = slotService.addSlot(mentorId, slot);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/available/{mentorId}")
    public List<Slot> getAvailableSlots(@PathVariable Long mentorId) {
        return slotService.getAvailableSlots(mentorId);
    }
}

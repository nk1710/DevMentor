package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Slot;
import com.example.demo.service.SlotService;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @PostMapping("/add/{mentorId}")
    public ResponseEntity<?> addSlot(
            @PathVariable Long mentorId,
            @RequestBody Slot slot) {

        System.out.println("MentorId received: " + mentorId);
        Slot saved = slotService.addSlot(mentorId, slot);

        if (saved == null) {
            return ResponseEntity.status(500)
                    .body("Mentor not found: " + mentorId);
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/available/{mentorId}")
    public List<Slot> getAvailableSlots(@PathVariable Long mentorId) {
        return slotService.getAvailableSlots(mentorId);
    }
}

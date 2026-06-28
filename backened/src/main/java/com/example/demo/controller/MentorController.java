package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.config.JwtUtil;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.Mentor;
import com.example.demo.service.MentorService;
import java.util.List;
import com.example.demo.entity.CollegeSession;
import com.example.demo.repository.CollegeSessionRepository;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    @Autowired
    private MentorService mentorService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CollegeSessionRepository collegeSessionRepository;

    // Register
    @PostMapping("/register")
    public ResponseEntity<?> registerMentor(@RequestBody Mentor mentor) {
        try {
            Mentor saved = mentorService.registerMentor(mentor);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Registration failed: " + e.getMessage());
        }
    }

    // Mentor ke college sessions
    @GetMapping("/{id}/college-sessions")
    public ResponseEntity<List<CollegeSession>> getMentorCollegeSessions(
            @PathVariable Long id) {
        try {
            var sessions = collegeSessionRepository
                .findByMentorId(id);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.ok(
                new java.util.ArrayList<>()
            );
        }
    }

    // Login — JWT token return karo
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Mentor mentor = mentorService.login(
            request.getEmail(),
            request.getPassword()
        );

        if (mentor == null) {
            return ResponseEntity.status(401)
                .body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
            mentor.getEmail(),
            "MENTOR",
            mentor.getId()
        );

        return ResponseEntity.ok(new LoginResponse(
            mentor.getId(),
            mentor.getName(),
            mentor.getEmail(),
            "MENTOR",
            token
        ));
    }

    @GetMapping("/all")
    public List<Mentor> getAllMentors() {
        return mentorService.getAllMentors();
    }

    @GetMapping("/search")
    public List<Mentor> searchBySkill(@RequestParam String skill) {
        return mentorService.getMentorsBySkill(skill);
    }

    @GetMapping("/{id}")
    public Mentor getMentorById(@PathVariable Long id) {
        return mentorService.getMentorById(id);
    }

    @PutMapping("/profile/{id}")
    public Mentor updateProfile(
            @PathVariable Long id,
            @RequestBody Mentor mentor) {
        return mentorService.updateProfile(id, mentor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMentor(@PathVariable Long id) {
        mentorService.deleteMentor(id);
        return ResponseEntity.ok("Deleted");
    }
}

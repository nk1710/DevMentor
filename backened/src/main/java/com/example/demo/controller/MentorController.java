package com.example.demo.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @Value("${cookie.secure}")
    private boolean cookieSecure;

    @Value("${cookie.same-site}")
    private String cookieSameSite;

    @PostMapping("/register")
    public ResponseEntity<?> registerMentor(@Valid @RequestBody Mentor mentor) {
        try {
            Mentor saved = mentorService.registerMentor(mentor);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/college-sessions")
    public ResponseEntity<List<CollegeSession>> getMentorCollegeSessions(
            @PathVariable Long id, Authentication auth) {
        if (!isOwnerOrAdmin(id, auth)) {
            return ResponseEntity.status(403).body(List.of());
        }
        try {
            var sessions = collegeSessionRepository
                .findByMentorId(id);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
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

        ResponseCookie cookie = ResponseCookie.from("token", token)
            .httpOnly(true)
            .secure(cookieSecure)
            .sameSite(cookieSameSite)
            .path("/")
            .maxAge(86400)
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(new LoginResponse(
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
    public List<Mentor> searchBySkill(@RequestParam(defaultValue = "") String skill) {
        return mentorService.getMentorsBySkill(skill);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMentorById(@PathVariable Long id) {
        Mentor mentor = mentorService.getMentorById(id);
        if (mentor == null) return ResponseEntity.status(404).body("Mentor not found");
        return ResponseEntity.ok(mentor);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Mentor mentor,
            Authentication auth) {
        if (!isOwnerOrAdmin(id, auth)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        Mentor updated = mentorService.updateProfile(id, mentor);
        if (updated == null) return ResponseEntity.badRequest().body("Mentor not found");
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMentor(@PathVariable Long id) {
        mentorService.deleteMentor(id);
        return ResponseEntity.ok("Deleted");
    }

    private boolean isOwnerOrAdmin(Long mentorId, Authentication auth) {
        if (auth == null) return false;
        String email = auth.getName();
        Mentor mentor = mentorService.getMentorById(mentorId);
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return (mentor != null && mentor.getEmail().equals(email)) || isAdmin;
    }
}
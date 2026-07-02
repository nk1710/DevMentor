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
import com.example.demo.entity.College;
import com.example.demo.entity.CollegeSession;
import com.example.demo.entity.Mentor;
import com.example.demo.repository.CollegeRepository;
import com.example.demo.repository.MentorRepository;
import com.example.demo.service.CollegeService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    @Autowired
    private CollegeService collegeService;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${cookie.secure}")
    private boolean cookieSecure;

    @Value("${cookie.same-site}")
    private String cookieSameSite;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody College college) {
        try {
            College saved = collegeService.register(college);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        College college = collegeService.login(
            request.getEmail(),
            request.getPassword()
        );
        if (college == null) {
            return ResponseEntity.status(401)
                .body("Invalid credentials");
        }
        String token = jwtUtil.generateToken(
            college.getEmail(),
            "COLLEGE",
            college.getId()
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
                college.getId(),
                college.getName(),
                college.getEmail(),
                "COLLEGE",
                token
            ));
    }

    @GetMapping("/all")
    public List<College> getAllColleges() {
        return collegeService.getAllColleges();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollegeById(@PathVariable Long id) {
        College college = collegeService.getCollegeById(id);
        if (college == null) return ResponseEntity.status(404).body("College not found");
        return ResponseEntity.ok(college);
    }

    @PutMapping("/upgrade/{id}")
    public ResponseEntity<?> upgradePlan(
            @PathVariable Long id,
            @RequestParam String plan,
            @RequestParam String expiry) {
        College updated = collegeService.upgradePlan(id, plan, expiry);
        if (updated == null)
            return ResponseEntity.badRequest().body("Not found");
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollege(@PathVariable Long id) {
        collegeService.deleteCollege(id);
        return ResponseEntity.ok("Deleted");
    }

    @PostMapping("/{collegeId}/sessions/book/{mentorId}")
    public ResponseEntity<?> bookSession(
            Authentication auth,
            @PathVariable Long collegeId,
            @PathVariable Long mentorId,
            @Valid @RequestBody CollegeSession session) {
        if (!isCollegeOwner(auth, collegeId)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        CollegeSession saved = collegeService
            .bookSession(collegeId, mentorId, session);
        if (saved == null)
            return ResponseEntity.badRequest().body("Booking failed");
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{collegeId}/sessions")
    public ResponseEntity<?> getCollegeSessions(
            Authentication auth,
            @PathVariable Long collegeId) {
        if (!canAccessCollege(auth, collegeId)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        return ResponseEntity.ok(collegeService.getCollegeSessions(collegeId));
    }

    @GetMapping("/sessions/all")
    public List<CollegeSession> getAllSessions() {
        return collegeService.getAllSessions();
    }

    @PutMapping("/sessions/{sessionId}/status")
    public ResponseEntity<?> updateStatus(
            Authentication auth,
            @PathVariable Long sessionId,
            @RequestParam String status) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        CollegeSession updated = collegeService
            .updateSessionStatus(sessionId, status);
        if (updated == null)
            return ResponseEntity.badRequest().body("Not found");
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/sessions/{sessionId}/questions")
    public ResponseEntity<?> addQuestions(
            Authentication auth,
            @PathVariable Long sessionId,
            @RequestParam String questions) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        CollegeSession updated = collegeService
            .addQuestions(sessionId, questions);
        if (updated == null)
            return ResponseEntity.badRequest().body("Not found");
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{collegeId}/payment/create")
    public ResponseEntity<?> createPayment(
            Authentication auth,
            @PathVariable Long collegeId,
            @RequestParam String plan) {
        if (!isCollegeOwner(auth, collegeId)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        Map<String, Object> order = collegeService
            .createPaymentOrder(collegeId, plan);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{collegeId}/payment/success")
    public ResponseEntity<?> paymentSuccess(
            Authentication auth,
            @PathVariable Long collegeId,
            @RequestParam String plan,
            @RequestParam String paymentId) {
        if (!isCollegeOwner(auth, collegeId)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        College college = collegeService
            .activatePlan(collegeId, plan, paymentId);
        if (college == null)
            return ResponseEntity.badRequest().body("Activation failed");
        return ResponseEntity.ok(college);
    }

    @PutMapping("/sessions/{sessionId}/confirm")
    public ResponseEntity<?> confirmSession(
            Authentication auth,
            @PathVariable Long sessionId) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        CollegeSession updated = collegeService
            .updateSessionStatus(sessionId, "CONFIRMED");
        if (updated == null)
            return ResponseEntity.status(404).body("Session not found");
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/sessions/{sessionId}/complete")
    public ResponseEntity<?> completeSession(
            Authentication auth,
            @PathVariable Long sessionId) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body("Access denied");
        }
        CollegeSession updated = collegeService
            .updateSessionStatus(sessionId, "COMPLETED");
        if (updated == null)
            return ResponseEntity.status(404).body("Session not found");
        return ResponseEntity.ok(updated);
    }

    private boolean isCollegeOwner(Authentication auth, Long collegeId) {
        if (auth == null) return false;
        String email = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return true;
        College college = collegeRepository.findByEmail(email);
        return college != null && college.getId().equals(collegeId);
    }

    private boolean canAccessCollege(Authentication auth, Long collegeId) {
        if (auth == null) return false;
        String email = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return true;
        College college = collegeRepository.findByEmail(email);
        if (college != null && college.getId().equals(collegeId)) return true;
        Mentor mentor = mentorRepository.findByEmail(email);
        return mentor != null;
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}

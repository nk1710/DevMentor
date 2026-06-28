package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.config.JwtUtil;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.College;
import com.example.demo.entity.CollegeSession;
import com.example.demo.service.CollegeService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    @Autowired
    private CollegeService collegeService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody College college) {
        try {
            College saved =
                collegeService.register(college);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Failed: " + e.getMessage());
        }
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {
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
        return ResponseEntity.ok(new LoginResponse(
            college.getId(),
            college.getName(),
            college.getEmail(),
            "COLLEGE",
            token
        ));
    }

    // ✅ All colleges
    @GetMapping("/all")
    public List<College> getAllColleges() {
        return collegeService.getAllColleges();
    }

    // ✅ By ID
    @GetMapping("/{id}")
    public College getCollegeById(
            @PathVariable Long id) {
        return collegeService.getCollegeById(id);
    }

    // ✅ Upgrade plan
    @PutMapping("/upgrade/{id}")
    public ResponseEntity<?> upgradePlan(
            @PathVariable Long id,
            @RequestParam String plan,
            @RequestParam String expiry) {
        College updated = collegeService
            .upgradePlan(id, plan, expiry);
        if (updated == null)
            return ResponseEntity.badRequest()
                .body("Not found");
        return ResponseEntity.ok(updated);
    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollege(
            @PathVariable Long id) {
        collegeService.deleteCollege(id);
        return ResponseEntity.ok("Deleted");
    }

    // ✅ Book session
    @PostMapping("/{collegeId}/sessions/book/{mentorId}")
    public ResponseEntity<?> bookSession(
            @PathVariable Long collegeId,
            @PathVariable Long mentorId,
            @RequestBody CollegeSession session) {
        CollegeSession saved = collegeService
            .bookSession(collegeId, mentorId, session);
        if (saved == null)
            return ResponseEntity.badRequest()
                .body("Booking failed");
        return ResponseEntity.ok(saved);
    }

    // ✅ College sessions
    @GetMapping("/{collegeId}/sessions")
    public List<CollegeSession> getCollegeSessions(
            @PathVariable Long collegeId) {
        return collegeService
            .getCollegeSessions(collegeId);
    }

    // ✅ All sessions — Admin
    @GetMapping("/sessions/all")
    public List<CollegeSession> getAllSessions() {
        return collegeService.getAllSessions();
    }

    // ✅ Update session status
    @PutMapping("/sessions/{sessionId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long sessionId,
            @RequestParam String status) {
        CollegeSession updated = collegeService
            .updateSessionStatus(sessionId, status);
        if (updated == null)
            return ResponseEntity.badRequest()
                .body("Not found");
        return ResponseEntity.ok(updated);
    }

    // ✅ Add questions
    @PutMapping("/sessions/{sessionId}/questions")
    public ResponseEntity<?> addQuestions(
            @PathVariable Long sessionId,
            @RequestParam String questions) {
        CollegeSession updated = collegeService
            .addQuestions(sessionId, questions);
        if (updated == null)
            return ResponseEntity.badRequest()
                .body("Not found");
        return ResponseEntity.ok(updated);
    }
    // ✅ Payment order
@PostMapping("/{collegeId}/payment/create")
public ResponseEntity<?> createPayment(
        @PathVariable Long collegeId,
        @RequestParam String plan) {
    Map<String, Object> order = collegeService
        .createPaymentOrder(collegeId, plan);
    return ResponseEntity.ok(order);
}

// ✅ Payment success — plan activate karo
@PostMapping("/{collegeId}/payment/success")
public ResponseEntity<?> paymentSuccess(
        @PathVariable Long collegeId,
        @RequestParam String plan,
        @RequestParam String paymentId) {
    College college = collegeService
        .activatePlan(collegeId, plan, paymentId);
    if (college == null)
        return ResponseEntity.badRequest()
            .body("Failed");
    return ResponseEntity.ok(college);
}

// ✅ Session confirm karo — Mentor kare
@PutMapping("/sessions/{sessionId}/confirm")
public ResponseEntity<?> confirmSession(
        @PathVariable Long sessionId) {
    CollegeSession updated = collegeService
        .updateSessionStatus(sessionId, "CONFIRMED");
    return ResponseEntity.ok(updated);
}

// ✅ Session complete karo
@PutMapping("/sessions/{sessionId}/complete")
public ResponseEntity<?> completeSession(
        @PathVariable Long sessionId) {
    CollegeSession updated = collegeService
        .updateSessionStatus(sessionId, "COMPLETED");
    return ResponseEntity.ok(updated);
}
}

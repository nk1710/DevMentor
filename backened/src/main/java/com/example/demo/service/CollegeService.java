package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.entity.College;
import com.example.demo.entity.CollegeSession;
import com.example.demo.entity.Mentor;
import com.example.demo.repository.CollegeRepository;
import com.example.demo.repository.CollegeSessionRepository;
import com.example.demo.repository.MentorRepository;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CollegeSessionRepository sessionRepository;

    @Autowired
    private MentorRepository mentorRepository;

    private BCryptPasswordEncoder encoder =
        new BCryptPasswordEncoder();

    // ✅ Register
    public College register(College college) {
        college.setPassword(
            encoder.encode(college.getPassword())
        );
        college.setIsActive(true);
        college.setPlan("BASIC");
        return collegeRepository.save(college);
    }

    // ✅ Login
    public College login(String email, String password) {
        College college =
            collegeRepository.findByEmail(email);
        if (college == null) return null;
        if (encoder.matches(password, college.getPassword())) {
            return college;
        }
        return null;
    }

    // ✅ All colleges
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    // ✅ By ID
    public College getCollegeById(Long id) {
        return collegeRepository
            .findById(id).orElse(null);
    }

    // ✅ Plan upgrade
    public College upgradePlan(Long id,
            String plan, String expiry) {
        College college = collegeRepository
            .findById(id).orElse(null);
        if (college == null) return null;
        college.setPlan(plan);
        college.setSubscriptionExpiry(expiry);
        return collegeRepository.save(college);
    }

    // ✅ Delete
    public void deleteCollege(Long id) {
        collegeRepository.deleteById(id);
    }

    // ✅ Book session
    public CollegeSession bookSession(
            Long collegeId, Long mentorId,
            CollegeSession session) {

        College college = collegeRepository
            .findById(collegeId).orElse(null);
        Mentor mentor = mentorRepository
            .findById(mentorId).orElse(null);

        if (college == null || mentor == null)
            return null;

        session.setCollege(college);
        session.setMentor(mentor);
        session.setStatus("PENDING");
        session.setRoomId("college-" + collegeId
            + "-" + mentorId + "-"
            + System.currentTimeMillis());

        return sessionRepository.save(session);
    }

    // ✅ College sessions
    public List<CollegeSession> getCollegeSessions(
            Long collegeId) {
        return sessionRepository
            .findByCollegeId(collegeId);
    }

    // ✅ All sessions
    public List<CollegeSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    // ✅ Update session status
    public CollegeSession updateSessionStatus(
            Long sessionId, String status) {
        CollegeSession session = sessionRepository
            .findById(sessionId).orElse(null);
        if (session == null) return null;
        session.setStatus(status);
        return sessionRepository.save(session);
    }

    // ✅ Add questions
    public CollegeSession addQuestions(
            Long sessionId, String questions) {
        CollegeSession session = sessionRepository
            .findById(sessionId).orElse(null);
        if (session == null) return null;
        session.setQuestions(questions);
        return sessionRepository.save(session);
    }

    // Payment order create karo
public Map<String, Object> createPaymentOrder(
        Long collegeId, String plan) {

    Map<String, Object> order = new HashMap<>();

    // Plan ke hisaab se amount
    int amount = 0;
    switch (plan) {
        case "BASIC": amount = 999900; break;      // ₹9,999
        case "PRO": amount = 1999900; break;        // ₹19,999
        case "ENTERPRISE": amount = 3999900; break; // ₹39,999
    }

    order.put("amount", amount);
    order.put("currency", "INR");
    order.put("plan", plan);
    order.put("collegeId", collegeId);

    return order;
}

// Payment verify karo aur plan activate karo
public College activatePlan(Long collegeId,
        String plan, String paymentId) {
    College college = collegeRepository
        .findById(collegeId).orElse(null);
    if (college == null) return null;

    college.setPlan(plan);
    college.setIsActive(true);

    // 30 din ka subscription
    java.time.LocalDate expiry =
        java.time.LocalDate.now().plusDays(30);
    college.setSubscriptionExpiry(expiry.toString());

    return collegeRepository.save(college);
}
}
package com.example.demo.service;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.College;
import com.example.demo.entity.CollegeSession;
import com.example.demo.entity.Mentor;
import com.example.demo.repository.CollegeRepository;
import com.example.demo.repository.CollegeSessionRepository;
import com.example.demo.repository.MentorRepository;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@Service
@Transactional
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CollegeSessionRepository sessionRepository;

    @Autowired
    private MentorRepository mentorRepository;

    private BCryptPasswordEncoder encoder =
        new BCryptPasswordEncoder();

    public College register(College college) {
        if (college.getPassword() == null || college.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (college.getEmail() == null || !college.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (collegeRepository.findByEmail(college.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered");
        }
        college.setPassword(
            encoder.encode(college.getPassword())
        );
        college.setIsActive(true);
        college.setPlan("BASIC");
        return collegeRepository.save(college);
    }

    public College login(String email, String password) {
        if (email == null || password == null) return null;
        College college =
            collegeRepository.findByEmail(email);
        if (college == null) return null;
        if (encoder.matches(password, college.getPassword())) {
            return college;
        }
        return null;
    }

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College getCollegeById(Long id) {
        return collegeRepository
            .findById(id).orElse(null);
    }

    public College upgradePlan(Long id,
            String plan, String expiry) {
        if (plan == null || expiry == null) return null;
        College college = collegeRepository
            .findById(id).orElse(null);
        if (college == null) return null;
        college.setPlan(plan);
        college.setSubscriptionExpiry(expiry);
        return collegeRepository.save(college);
    }

    public void deleteCollege(Long id) {
        collegeRepository.findById(id).ifPresent(c -> collegeRepository.delete(c));
    }

    public CollegeSession bookSession(
            Long collegeId, Long mentorId,
            CollegeSession session) {

        College college = collegeRepository
            .findById(collegeId).orElse(null);
        Mentor mentor = mentorRepository
            .findById(mentorId).orElse(null);

        if (college == null || mentor == null)
            return null;

        if (session.getScheduledDate() != null && session.getScheduledTime() != null) {
            List<CollegeSession> existing = sessionRepository.findByMentorId(mentorId);
            for (CollegeSession es : existing) {
                boolean sameDate = es.getScheduledDate() != null
                    && es.getScheduledDate().equals(session.getScheduledDate());
                boolean timeOverlaps = es.getScheduledTime() != null
                    && es.getScheduledTime().equals(session.getScheduledTime());
                boolean isActive = !"CANCELLED".equals(es.getStatus())
                    && !"COMPLETED".equals(es.getStatus());
                if (sameDate && timeOverlaps && isActive) {
                    return null;
                }
            }
        }

        session.setCollege(college);
        session.setMentor(mentor);
        session.setStatus("PENDING");
        session.setRoomId("cs-" + UUID.randomUUID().toString().substring(0, 12));

        return sessionRepository.save(session);
    }

    public List<CollegeSession> getCollegeSessions(
            Long collegeId) {
        return sessionRepository
            .findByCollegeId(collegeId);
    }

    public List<CollegeSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    public CollegeSession updateSessionStatus(
            Long sessionId, String status) {
        CollegeSession session = sessionRepository
            .findById(sessionId).orElse(null);
        if (session == null) return null;
        session.setStatus(status);
        return sessionRepository.save(session);
    }

    public CollegeSession addQuestions(
            Long sessionId, String questions) {
        CollegeSession session = sessionRepository
            .findById(sessionId).orElse(null);
        if (session == null) return null;
        session.setQuestions(Jsoup.clean(questions, Safelist.none()));
        return sessionRepository.save(session);
    }

    public Map<String, Object> createPaymentOrder(
            Long collegeId, String plan) {

        Map<String, Object> order = new HashMap<>();

        int amount = 0;
        switch (plan) {
            case "BASIC": amount = 999900; break;
            case "PRO": amount = 1999900; break;
            case "ENTERPRISE": amount = 3999900; break;
            default: amount = 0;
        }

        order.put("amount", amount);
        order.put("currency", "INR");
        order.put("plan", plan);
        order.put("collegeId", collegeId);

        return order;
    }

    public College activatePlan(Long collegeId,
            String plan, String paymentId) {
        if (plan == null || paymentId == null || paymentId.trim().isEmpty()) {
            return null;
        }
        College college = collegeRepository
            .findById(collegeId).orElse(null);
        if (college == null) return null;

        college.setPlan(plan);
        college.setIsActive(true);

        java.time.LocalDate expiry =
            java.time.LocalDate.now().plusDays(30);
        college.setSubscriptionExpiry(expiry.toString());

        return collegeRepository.save(college);
    }
}

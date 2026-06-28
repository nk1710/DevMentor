package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.CollegeSession;
import java.util.List;

public interface CollegeSessionRepository
        extends JpaRepository<CollegeSession, Long> {
    List<CollegeSession> findByCollegeId(Long collegeId);
    List<CollegeSession> findByMentorId(Long mentorId);
    List<CollegeSession> findByStatus(String status);
}
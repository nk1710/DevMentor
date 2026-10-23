package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Mentor;
import java.util.List;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
    
    List<Mentor> findBySkillsContaining(String skill);
    
    // Find mentor by email
    Mentor findByEmail(String email);
}

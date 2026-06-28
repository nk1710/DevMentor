package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Mentor;
import java.util.List;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
    
    List<Mentor> findBySkillsContaining(String skill);
    
    // ✅ YE ADD KARO
    Mentor findByEmail(String email);
}

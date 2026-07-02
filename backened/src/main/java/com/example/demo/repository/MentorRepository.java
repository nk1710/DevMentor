package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.demo.entity.Mentor;
import java.util.List;

public interface MentorRepository extends JpaRepository<Mentor, Long> {

    @Query("SELECT m FROM Mentor m WHERE LOWER(m.skills) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<Mentor> findBySkillsContaining(@Param("skill") String skill);

    Mentor findByEmail(String email);
}

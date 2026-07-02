package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import com.example.demo.entity.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @EntityGraph(attributePaths = {"mentor", "slot", "user"})
    List<Booking> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"mentor", "slot", "user"})
    List<Booking> findByMentorId(Long mentorId);

    @EntityGraph(attributePaths = {"mentor", "slot", "user"})
    List<Booking> findAll();
}

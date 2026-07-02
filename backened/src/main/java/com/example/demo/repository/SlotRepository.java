package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.demo.entity.Slot;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    @EntityGraph(attributePaths = {"mentor"})
    List<Slot> findByMentorIdAndBooked(Long mentorId, boolean booked);

    @Query("SELECT s FROM Slot s LEFT JOIN FETCH s.mentor WHERE s.id = :id")
    Optional<Slot> findByIdWithMentor(@Param("id") Long id);
}
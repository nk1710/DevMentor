package com.example.demo.config;

import com.example.demo.entity.Mentor;
import com.example.demo.entity.Slot;
import com.example.demo.entity.User;
import com.example.demo.repository.MentorRepository;
import com.example.demo.repository.SlotRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private SlotRepository slotRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        // 1. Seed Default Admin
        User existingAdmin = userRepository.findByEmail("admin@devmentor.in");
        if (existingAdmin == null) {
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail("admin@devmentor.in");
            admin.setPassword(encoder.encode("Admin@123"));
            admin.setRole("ADMIN");
            admin.setBio("System Administrator");
            userRepository.save(admin);
            System.out.println(">>> Initialized default admin account: admin@devmentor.in / Admin@123");
        }

        // 2. Seed Default Mentor
        Mentor existingMentor = mentorRepository.findByEmail("mentor@devmentor.in");
        if (existingMentor == null) {
            Mentor mentor = new Mentor();
            mentor.setName("Rahul Sharma");
            mentor.setEmail("mentor@devmentor.in");
            mentor.setPassword(encoder.encode("Mentor@123"));
            mentor.setDesignation("Lead Full Stack Engineer");
            mentor.setBio("Ex-Amazon, 7+ years mentoring 500+ students in Java, React, and Cloud.");
            mentor.setSkills("Java, Spring Boot, React, AWS, Microservices");
            mentor.setLocation("Bengaluru, India");
            mentor.setExperience("7+ Years");
            mentor.setPricePerHour(500.0);
            mentor.setPricePerMinute(10.0);
            mentor.setRating(4.9);
            mentor.setIsAvailable(true);
            mentor.setRole("MENTOR");
            mentor = mentorRepository.save(mentor);
            System.out.println(">>> Initialized default mentor account: mentor@devmentor.in / Mentor@123");

            // Seed sample slot for the mentor
            Slot slot = new Slot();
            slot.setMentor(mentor);
            slot.setDate("2026-11-05");
            slot.setStartTime("10:00");
            slot.setEndTime("11:00");
            slot.setBooked(false);
            slotRepository.save(slot);
            System.out.println(">>> Initialized sample slot for Rahul Sharma");
        }
    }
}

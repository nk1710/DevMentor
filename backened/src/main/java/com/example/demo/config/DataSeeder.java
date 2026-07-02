package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.example.demo.entity.Mentor;
import com.example.demo.entity.User;
import com.example.demo.repository.MentorRepository;
import com.example.demo.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MentorRepository mentorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, MentorRepository mentorRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mentorRepository = mentorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@devmentor.in") == null) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@devmentor.in");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Default admin user created");
        }

        if (userRepository.findByEmail("user@test.com") == null) {
            User testUser = new User();
            testUser.setName("Test User");
            testUser.setEmail("user@test.com");
            testUser.setPassword(passwordEncoder.encode("password123"));
            testUser.setRole("USER");
            userRepository.save(testUser);
            System.out.println("Test user created: user@test.com / password123");
        }

        if (mentorRepository.findByEmail("mentor@test.com") == null) {
            Mentor mentor = new Mentor();
            mentor.setName("Test Mentor");
            mentor.setEmail("mentor@test.com");
            mentor.setPassword(passwordEncoder.encode("password123"));
            mentor.setSkills("Java, Spring Boot, React");
            mentor.setExperience("5 years");
            mentor.setDesignation("Senior Developer");
            mentor.setBio("Experienced mentor for testing");
            mentor.setPricePerHour(500.0);
            mentor.setPricePerMinute(10.0);
            mentor.setRating(4.5);
            mentor.setIsAvailable(true);
            mentorRepository.save(mentor);
            System.out.println("Test mentor created: mentor@test.com / password123");
        }
    }
}

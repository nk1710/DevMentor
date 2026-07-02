package com.example.demo.service;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.Mentor;
import com.example.demo.repository.MentorRepository;
import java.util.List;

@Service
@Transactional
public class MentorService {

    @Autowired
    private MentorRepository mentorRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Mentor registerMentor(Mentor mentor) {
        if (mentor.getPassword() == null || mentor.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (mentor.getEmail() == null || !mentor.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (mentorRepository.findByEmail(mentor.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered");
        }
        mentor.setPassword(encoder.encode(mentor.getPassword()));
        mentor.setRole("MENTOR");
        return mentorRepository.save(mentor);
    }

    public Mentor login(String email, String password) {
        if (email == null || password == null) return null;
        Mentor mentor = mentorRepository.findByEmail(email);
        if (mentor == null) return null;
        if (encoder.matches(password, mentor.getPassword())) {
            return mentor;
        }
        return null;
    }

    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    public List<Mentor> getMentorsBySkill(String skill) {
        if (skill == null || skill.trim().isEmpty()) {
            return mentorRepository.findAll();
        }
        return mentorRepository.findBySkillsContaining(skill);
    }

    public Mentor getMentorById(Long id) {
        return mentorRepository.findById(id).orElse(null);
    }

    public Mentor updateProfile(Long id, Mentor updatedMentor) {
        Mentor mentor = mentorRepository.findById(id).orElse(null);
        if (mentor == null) return null;

        if (updatedMentor.getBio() != null)
            mentor.setBio(Jsoup.clean(updatedMentor.getBio(), Safelist.none()));
        if (updatedMentor.getDesignation() != null)
            mentor.setDesignation(Jsoup.clean(updatedMentor.getDesignation(), Safelist.none()));
        if (updatedMentor.getLocation() != null)
            mentor.setLocation(Jsoup.clean(updatedMentor.getLocation(), Safelist.none()));
        if (updatedMentor.getPhone() != null)
            mentor.setPhone(Jsoup.clean(updatedMentor.getPhone(), Safelist.none()));
        if (updatedMentor.getLinkedinUrl() != null)
            mentor.setLinkedinUrl(Jsoup.clean(updatedMentor.getLinkedinUrl(), Safelist.none()));
        if (updatedMentor.getGithubUrl() != null)
            mentor.setGithubUrl(Jsoup.clean(updatedMentor.getGithubUrl(), Safelist.none()));
        if (updatedMentor.getResumeUrl() != null)
            mentor.setResumeUrl(Jsoup.clean(updatedMentor.getResumeUrl(), Safelist.none()));
        if (updatedMentor.getPricePerMinute() != null)
            mentor.setPricePerMinute(updatedMentor.getPricePerMinute());
        if (updatedMentor.getIsAvailable() != null)
            mentor.setIsAvailable(updatedMentor.getIsAvailable());
        if (updatedMentor.getSkills() != null)
            mentor.setSkills(Jsoup.clean(updatedMentor.getSkills(), Safelist.none()));
        if (updatedMentor.getExperience() != null)
            mentor.setExperience(Jsoup.clean(updatedMentor.getExperience(), Safelist.none()));
        if (updatedMentor.getPricePerHour() != null)
            mentor.setPricePerHour(updatedMentor.getPricePerHour());

        return mentorRepository.save(mentor);
    }

    public void deleteMentor(Long id) {
        mentorRepository.findById(id).ifPresent(m -> mentorRepository.delete(m));
    }
}
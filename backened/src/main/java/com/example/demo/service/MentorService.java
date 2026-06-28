package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Mentor;
import com.example.demo.repository.MentorRepository;
import java.util.List;

@Service
public class MentorService {

    @Autowired
    private MentorRepository mentorRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Mentor registerMentor(Mentor mentor) {
        mentor.setPassword(encoder.encode(mentor.getPassword()));
        return mentorRepository.save(mentor);
    }

    public Mentor login(String email, String password) {
        Mentor mentor = mentorRepository.findByEmail(email);

        if (mentor == null) return null;

        // Encrypted password check
        try {
            if (encoder.matches(password, mentor.getPassword())) {
                return mentor;
            }
        } catch (Exception e) {
            // Plain text check (purana data)
            if (mentor.getPassword().equals(password)) {
                return mentor;
            }
        }
        return null;
    }

    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    public List<Mentor> getMentorsBySkill(String skill) {
        return mentorRepository.findBySkillsContaining(skill);
    }

    public Mentor getMentorById(Long id) {
        return mentorRepository.findById(id).orElse(null);
    }

    public Mentor updateProfile(Long id, Mentor updatedMentor) {
        Mentor mentor = mentorRepository.findById(id).orElse(null);
        if (mentor == null) return null;

        if (updatedMentor.getBio() != null)
            mentor.setBio(updatedMentor.getBio());
        if (updatedMentor.getDesignation() != null)
            mentor.setDesignation(updatedMentor.getDesignation());
        if (updatedMentor.getLocation() != null)
            mentor.setLocation(updatedMentor.getLocation());
        if (updatedMentor.getPhone() != null)
            mentor.setPhone(updatedMentor.getPhone());
        if (updatedMentor.getLinkedinUrl() != null)
            mentor.setLinkedinUrl(updatedMentor.getLinkedinUrl());
        if (updatedMentor.getGithubUrl() != null)
            mentor.setGithubUrl(updatedMentor.getGithubUrl());
        if (updatedMentor.getResumeUrl() != null)
            mentor.setResumeUrl(updatedMentor.getResumeUrl());
        if (updatedMentor.getPricePerMinute() != null)
            mentor.setPricePerMinute(updatedMentor.getPricePerMinute());
        if (updatedMentor.getIsAvailable() != null)
            mentor.setIsAvailable(updatedMentor.getIsAvailable());
        if (updatedMentor.getSkills() != null)
            mentor.setSkills(updatedMentor.getSkills());
        if (updatedMentor.getExperience() != null)
            mentor.setExperience(updatedMentor.getExperience());
        if (updatedMentor.getPricePerHour() != null)
            mentor.setPricePerHour(updatedMentor.getPricePerHour());

        return mentorRepository.save(mentor);
    }

    public void deleteMentor(Long id) {
        mentorRepository.deleteById(id);
    }
}
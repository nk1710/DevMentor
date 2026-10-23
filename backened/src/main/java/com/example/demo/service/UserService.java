package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.findByEmail(user.getEmail().trim()) != null) {
            throw new IllegalArgumentException("Email already registered: " + user.getEmail());
        }
        // Force USER role on public registration to prevent privilege escalation
        user.setRole("USER");
        user.setEmail(user.getEmail().trim().toLowerCase());
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        if (email == null || password == null) return null;
        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null) return null;

        boolean matches = encoder.matches(password, user.getPassword());
        if (matches) return user;
        return null;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateProfile(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;

        if (updatedUser.getName() != null)
            user.setName(updatedUser.getName());
        if (updatedUser.getBio() != null)
            user.setBio(updatedUser.getBio());
        if (updatedUser.getSkills() != null)
            user.setSkills(updatedUser.getSkills());
        if (updatedUser.getLocation() != null)
            user.setLocation(updatedUser.getLocation());
        if (updatedUser.getPhone() != null)
            user.setPhone(updatedUser.getPhone());
        if (updatedUser.getLinkedinUrl() != null)
            user.setLinkedinUrl(updatedUser.getLinkedinUrl());
        if (updatedUser.getGithubUrl() != null)
            user.setGithubUrl(updatedUser.getGithubUrl());
        if (updatedUser.getResumeUrl() != null)
            user.setResumeUrl(updatedUser.getResumeUrl());
        if (updatedUser.getProfilePicture() != null)
            user.setProfilePicture(updatedUser.getProfilePicture());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

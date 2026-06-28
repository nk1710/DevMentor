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
        // Password encrypt karo
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // ✅ Login — encrypted password check
  public User login(String email, String password) {
    System.out.println("Finding user: " + email);
    User user = userRepository.findByEmail(email);
    
    System.out.println("User exists: " + (user != null));
    
    if (user == null) return null;

    System.out.println("Checking password...");
    boolean matches = encoder.matches(password, user.getPassword());
    System.out.println("Password matches: " + matches);
    
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

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
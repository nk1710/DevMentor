package com.example.demo.service;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        if (email == null || password == null) return null;
        User user = userRepository.findByEmail(email);
        if (user == null) return null;
        if (encoder.matches(password, user.getPassword())) return user;
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
            user.setBio(Jsoup.clean(updatedUser.getBio(), Safelist.none()));
        if (updatedUser.getSkills() != null)
            user.setSkills(Jsoup.clean(updatedUser.getSkills(), Safelist.none()));
        if (updatedUser.getLocation() != null)
            user.setLocation(Jsoup.clean(updatedUser.getLocation(), Safelist.none()));
        if (updatedUser.getPhone() != null)
            user.setPhone(Jsoup.clean(updatedUser.getPhone(), Safelist.none()));
        if (updatedUser.getLinkedinUrl() != null)
            user.setLinkedinUrl(Jsoup.clean(updatedUser.getLinkedinUrl(), Safelist.none()));
        if (updatedUser.getGithubUrl() != null)
            user.setGithubUrl(Jsoup.clean(updatedUser.getGithubUrl(), Safelist.none()));
        if (updatedUser.getResumeUrl() != null)
            user.setResumeUrl(Jsoup.clean(updatedUser.getResumeUrl(), Safelist.none()));

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.findById(id).ifPresent(u -> userRepository.delete(u));
    }
}
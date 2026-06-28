package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.config.JwtUtil;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = userService.register(user);
            // Password hide karo response me
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Registration failed: " + e.getMessage());
        }
    }

    // ✅ Login — JWT token return karo
   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    System.out.println("Login attempt: " + request.getEmail());
    
    User user = userService.login(
        request.getEmail(),
        request.getPassword()
    );

    System.out.println("User found: " + (user != null));

    if (user == null) {
        return ResponseEntity.status(401)
            .body("Invalid email or password");
    }

    String token = jwtUtil.generateToken(
        user.getEmail(),
        user.getRole(),
        user.getId()
    );

    return ResponseEntity.ok(new LoginResponse(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getRole(),
        token
    ));
}
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/profile/{id}")
    public User updateProfile(
            @PathVariable Long id,
            @RequestBody User user) {
        return userService.updateProfile(id, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Deleted");
    }
}

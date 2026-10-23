package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "DevMentor Backend API is running! Available endpoints: /api/auth/login, /api/auth/register, /api/mentors";
    }

    @GetMapping("/api")
    public String apiInfo() {
        return "DevMentor API v1.0 - All endpoints are under /api/*";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}

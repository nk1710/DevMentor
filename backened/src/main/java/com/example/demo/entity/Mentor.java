package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "mentors", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
}, indexes = {
    @Index(name = "idx_mentor_email", columnList = "email"),
    @Index(name = "idx_mentor_skills", columnList = "skills"),
    @Index(name = "idx_mentor_available", columnList = "is_available")
})
public class Mentor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;
    @Column(unique = true)
    @NotBlank
    @Email
    @Size(max = 255)
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank
    @Size(min = 6, max = 255)
    private String password;
    @Size(max = 2000)
    private String skills;
    @Size(max = 100)
    private String experience;
    @Min(0)
    private Double pricePerHour;
    @Min(0)
    private Double pricePerMinute;
    @Min(0)
    @Max(5)
    private Double rating;
    @Size(max = 2000)
    private String bio;
    @Size(max = 255)
    private String location;
    private String profilePicture;
    @Size(max = 500)
    private String resumeUrl;
    @Size(max = 20)
    private String phone;
    @Size(max = 500)
    private String linkedinUrl;
    @Size(max = 500)
    private String githubUrl;
    @Size(max = 100)
    private String designation;
    private Integer totalSessions;
    private Boolean isAvailable;
    private String role = "MENTOR";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public Double getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(Double pricePerHour) { this.pricePerHour = pricePerHour; }

    public Double getPricePerMinute() { return pricePerMinute; }
    public void setPricePerMinute(Double pricePerMinute) { this.pricePerMinute = pricePerMinute; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public Integer getTotalSessions() { return totalSessions; }
    public void setTotalSessions(Integer totalSessions) { this.totalSessions = totalSessions; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

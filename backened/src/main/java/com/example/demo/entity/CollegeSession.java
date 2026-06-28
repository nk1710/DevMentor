package com.example.demo.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "college_sessions")
public class CollegeSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id")
    @JsonIgnoreProperties({"password"})
    private College college;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mentor_id")
    @JsonIgnoreProperties({"password"})
    private Mentor mentor;

    private String topic;
    private String scheduledDate;
    private String scheduledTime;
    private String status; // PENDING / CONFIRMED / COMPLETED
    private String sessionType; // LIVE / RECORDED
    private Integer maxStudents;
    private String roomId;
    private String questions; // students ke questions (JSON string)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }
    public Mentor getMentor() { return mentor; }
    public void setMentor(Mentor mentor) { this.mentor = mentor; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String d) { this.scheduledDate = d; }
    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String t) { this.scheduledTime = t; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSessionType() { return sessionType; }
    public void setSessionType(String s) { this.sessionType = s; }
    public Integer getMaxStudents() { return maxStudents; }
    public void setMaxStudents(Integer m) { this.maxStudents = m; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getQuestions() { return questions; }
    public void setQuestions(String q) { this.questions = q; }
}
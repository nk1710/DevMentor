package com.example.demo.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "colleges")
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String phone;
    private String address;
    private String city;
    private String contactPerson;
    private String plan;
    private Boolean isActive;
    private String subscriptionExpiry;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String p) { this.password = p; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String a) { this.address = a; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String cp) { this.contactPerson = cp; }
    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public String getSubscriptionExpiry() { return subscriptionExpiry; }
    public void setSubscriptionExpiry(String s) { this.subscriptionExpiry = s; }
}

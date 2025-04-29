package com.rentacar.model;

import java.time.LocalDateTime;

import javax.persistence.Entity;

import org.springframework.data.annotation.Id;

@Entity
public class VerificationToken {

    @Id
    private String token;

    @javax.persistence.OneToOne
    private User user;

    private LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

    public VerificationToken() {}

    public VerificationToken(String token, User user) {
        this.token = token;
        this.user = user;
        this.expiryDate = LocalDateTime.now().plusMinutes(15);
    }

    public boolean isExpired() {
        return expiryDate.isBefore(LocalDateTime.now());
    }

    // Getter ve Setter'lar
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }
}

package com.rentacar.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Otomatik id üretilir
    private Long id;

    @Column(nullable = false, unique = true)
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

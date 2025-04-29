package com.rentacar.dto;

public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String role;
    private Long userId;
    private String token;
    
    public LoginResponse(String accessToken, String username, String role, Long userId) {
        this.accessToken = accessToken;
        this.username = username;
        this.role = role;
        this.userId = userId;
    }

    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public LoginResponse(String token, String username, String role) {
    this.token = token;
    this.username = username;
    this.role = role;
}
}

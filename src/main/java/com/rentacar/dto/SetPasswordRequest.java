// SetPasswordRequest.java
package com.rentacar.dto;

public class SetPasswordRequest {
    private String token;
    private String password;

    // Getter - Setter
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}

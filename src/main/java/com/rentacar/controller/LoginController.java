package com.rentacar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rentacar.model.Admin;
import com.rentacar.repository.AdminRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

 @PostMapping("/api/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    System.out.println("Login request received: " + loginRequest.getUsername());
    
    // Kullanıcı adıyla admin arama
    Optional<Admin> optionalAdmin = adminRepository.findByUsername(loginRequest.getUsername());
    
    if (optionalAdmin.isPresent()) {
        Admin admin = optionalAdmin.get();
        
        // Şifre kontrolü
        if (passwordEncoder.matches(loginRequest.getPassword(), admin.getPasswordHash())) {
            // Başarılı giriş, token ve diğer bilgileri döndür
            Map<String, Object> response = new HashMap<>();
            response.put("token", "admin_token_" + System.currentTimeMillis());
            response.put("username", admin.getUsername());
            response.put("role", admin.getRole().name());
            
            return ResponseEntity.ok(response);
        }
    }
    
    // Hatalı giriş
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
}
}
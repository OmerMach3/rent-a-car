package com.rentacar.controller;

import com.rentacar.dto.UserLoginRequest;
import com.rentacar.dto.UserLoginResponse;
import com.rentacar.model.User;
import com.rentacar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserLoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest loginRequest) {
        System.out.println("User login attempt for email: " + loginRequest.getEmail());

        try {
            // Validate input
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email is required"));
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Password is required"));
            }

            // Find user by email
            Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase());

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }

            User user = optionalUser.get();

            // Check if user account is enabled
            if (!user.isEnabled()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Account is not activated. Please check your email and set your password."));
            }

            // Check if user has a password set
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Password not set. Please check your email and set your password."));
            }

            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }

            // Create response with user data including userId
            UserLoginResponse response = new UserLoginResponse();
            response.setToken("user_token_" + System.currentTimeMillis()); // Simple token for now
            response.setEmail(user.getEmail());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());
            response.setUserId(user.getId()); // This is important for ID-based routing

            System.out.println("User login successful for: " + user.getEmail() + " (ID: " + user.getId() + ")");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error during user login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred. Please try again."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Since we're using simple token-based auth, logout is handled on frontend
        // In a real application, you might want to invalidate the token here
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        
        return ResponseEntity.ok(response);
    }
}
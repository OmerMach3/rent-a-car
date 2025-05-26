package com.rentacar.controller;
// Add these imports to your existing UserController.java
import com.rentacar.dto.UpdateUserProfileRequest;
import com.rentacar.dto.UserProfileResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.rentacar.dto.DeleteAccountRequest;
import com.rentacar.dto.SetPasswordRequest;
import com.rentacar.dto.UpdateUserProfileRequest;
import com.rentacar.dto.UserDTO;
import com.rentacar.dto.UserProfileResponse;
import com.rentacar.model.User;
import com.rentacar.model.VerificationToken;
import com.rentacar.repository.UserRepository;
import com.rentacar.repository.VerificationTokenRepository;
import com.rentacar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.rentacar.repository.UserRepository;
import javax.validation.Valid;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
private PasswordEncoder passwordEncoder;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            User registeredUser = userService.registerUser(userDTO);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(@RequestBody DeleteAccountRequest request) {
        boolean deleted = userService.deleteUserByEmail(request.getEmail(), request.getPassword());
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Incorrect email or password."));
        }
        return ResponseEntity.ok(Map.of("message", "Account successfully deleted."));
    }
    
    @PostMapping("/set-password")
public ResponseEntity<String> setPassword(@RequestBody SetPasswordRequest request) {
    VerificationToken verificationToken = verificationTokenRepository.findByToken(request.getToken());

    if (verificationToken == null) {
        return ResponseEntity.badRequest().body("Invalid token.");
    }

    if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
        return ResponseEntity.badRequest().body("Token has expired.");
    }

    User user = verificationToken.getUser();
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setEnabled(true); // Artık hesabı aktif edelim
    userRepository.save(user);

    // Token işimiz bittiği için istersen silebilirsin:
    verificationTokenRepository.delete(verificationToken);

    return ResponseEntity.ok("Password set successfully.");
}

    // Get profile by email (existing method)
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);
            
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            User user = optionalUser.get();
            
            // Create response DTO
            UserProfileResponse profileResponse = createUserProfileResponse(user);

            return ResponseEntity.ok(profileResponse);

        } catch (Exception e) {
            System.err.println("Error fetching user profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred"));
        }
    }

    // NEW: Get profile by ID
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfileById(@PathVariable Long id) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);
            
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            User user = optionalUser.get();
            
            // Create response DTO
            UserProfileResponse profileResponse = createUserProfileResponse(user);

            return ResponseEntity.ok(profileResponse);

        } catch (Exception e) {
            System.err.println("Error fetching user profile by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred"));
        }
    }

    // Helper method to create UserProfileResponse
    private UserProfileResponse createUserProfileResponse(User user) {
        UserProfileResponse profileResponse = new UserProfileResponse();
        profileResponse.setId(user.getId());
        profileResponse.setFirstName(user.getFirstName());
        profileResponse.setLastName(user.getLastName());
        profileResponse.setEmail(user.getEmail());
        profileResponse.setPhoneNumber(user.getPhoneNumber());
        profileResponse.setBirthDate(user.getBirthDate());
        profileResponse.setBirthPlaceCity(user.getBirthPlaceCity());
        profileResponse.setBirthPlaceCountry(user.getBirthPlaceCountry());
        profileResponse.setGender(user.getGender());
        profileResponse.setAddress(user.getAddress());
        profileResponse.setEnabled(user.isEnabled());
        profileResponse.setCreatedAt(user.getCreatedAt());
        return profileResponse;
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UpdateUserProfileRequest request) {
        try {
            // Find user by current email
            Optional<User> optionalUser = userRepository.findByEmail(request.getCurrentEmail());
            
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            User user = optionalUser.get();

            // If user wants to change password, verify current password
            if (request.getCurrentPassword() != null && !request.getCurrentPassword().isEmpty()) {
                if (user.getPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("message", "Current password is incorrect"));
                }

                // Update password if new password is provided
                if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                }
            }

            // Check if new email is already in use by another user
            if (!user.getEmail().equals(request.getEmail())) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(Map.of("message", "Email is already in use by another account"));
                }
            }

            // Update user information
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());

            // Save updated user
            User updatedUser = userRepository.save(user);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", Map.of(
                "id", updatedUser.getId(),
                "firstName", updatedUser.getFirstName(),
                "lastName", updatedUser.getLastName(),
                "email", updatedUser.getEmail(),
                "phoneNumber", updatedUser.getPhoneNumber() != null ? updatedUser.getPhoneNumber() : ""
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error updating user profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred while updating profile"));
        }
    }
}
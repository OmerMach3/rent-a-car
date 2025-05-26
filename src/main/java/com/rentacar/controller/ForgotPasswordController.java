package com.rentacar.controller;

import com.rentacar.dto.ForgotPasswordRequest;
import com.rentacar.dto.ResetPasswordRequest;
import com.rentacar.model.User;
import com.rentacar.model.VerificationToken;
import com.rentacar.repository.UserRepository;
import com.rentacar.repository.VerificationTokenRepository;
import com.rentacar.service.email.PasswordResetEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "http://localhost:3000")
public class ForgotPasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordResetEmailService passwordResetEmailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            String email = request.getEmail();
            
            // Validate email
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email is required"));
            }

            // Check if user exists
            Optional<User> optionalUser = userRepository.findByEmail(email.trim().toLowerCase());
            
            if (optionalUser.isEmpty()) {
                // For security reasons, don't reveal if email exists or not
                return ResponseEntity.ok()
                        .body(Map.of("message", "If an account with this email exists, a password reset link has been sent."));
            }

            User user = optionalUser.get();

            // Check if user account is enabled
            if (!user.isEnabled()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Account is not activated. Please check your email and activate your account first."));
            }

            // Delete any existing tokens for this user (optional, for security)
            // This ensures only one active reset token per user
            verificationTokenRepository.findByUser(user).forEach(token -> {
                verificationTokenRepository.delete(token);
            });

            // Generate new reset token
            String token = UUID.randomUUID().toString();
            VerificationToken resetToken = new VerificationToken(token, user);
            // Set expiry to 15 minutes
            resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
            verificationTokenRepository.save(resetToken);

            // Send reset email
            passwordResetEmailService.sendPasswordResetLink(user.getEmail(), token);

            return ResponseEntity.ok()
                    .body(Map.of("message", "If an account with this email exists, a password reset link has been sent."));

        } catch (Exception e) {
            System.err.println("Error in forgot password: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "An unexpected error occurred. Please try again."));
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            String token = request.getToken();
            String newPassword = request.getNewPassword();
            String confirmPassword = request.getConfirmPassword();

            // Validate input
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid token"));
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "New password is required"));
            }

            if (confirmPassword == null || !newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Passwords do not match"));
            }

            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Password must be at least 6 characters long"));
            }

            // Find verification token
            VerificationToken verificationToken = verificationTokenRepository.findByToken(token);

            if (verificationToken == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid or expired reset token"));
            }

            // Check if token is expired
            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                // Clean up expired token
                verificationTokenRepository.delete(verificationToken);
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Reset token has expired. Please request a new password reset."));
            }

            // Get user and update password
            User user = verificationToken.getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            // Clean up the used token
            verificationTokenRepository.delete(verificationToken);

            return ResponseEntity.ok()
                    .body(Map.of("message", "Password has been successfully reset. You can now login with your new password."));

        } catch (Exception e) {
            System.err.println("Error in reset password: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "An unexpected error occurred. Please try again."));
        }
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("valid", false, "message", "Token is required"));
            }

            VerificationToken verificationToken = verificationTokenRepository.findByToken(token);

            if (verificationToken == null) {
                return ResponseEntity.ok()
                        .body(Map.of("valid", false, "message", "Invalid token"));
            }

            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return ResponseEntity.ok()
                        .body(Map.of("valid", false, "message", "Token has expired"));
            }

            return ResponseEntity.ok()
                    .body(Map.of("valid", true, "message", "Token is valid"));

        } catch (Exception e) {
            System.err.println("Error verifying token: " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("valid", false, "message", "Error verifying token"));
        }
    }
    @GetMapping("/test")
public ResponseEntity<?> testEndpoint() {
    return ResponseEntity.ok()
            .body(Map.of("message", "Password reset controller is working!", 
                        "timestamp", LocalDateTime.now()));
}

// Also add this method to test the forgot password endpoint specifically
@GetMapping("/forgot/test")  
public ResponseEntity<?> testForgotEndpoint() {
    return ResponseEntity.ok()
            .body(Map.of("message", "Forgot password endpoint is accessible", 
                        "endpoint", "/api/password/forgot",
                        "method", "POST"));
}
}
package com.rentacar.controller;

import com.rentacar.dto.SetPasswordRequest;
import com.rentacar.model.User;
import com.rentacar.model.VerificationToken;
import com.rentacar.repository.UserRepository;
import com.rentacar.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody SetPasswordRequest request) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(request.getToken());

        if (verificationToken == null) {
            return ResponseEntity.badRequest().body("Invalid token.");
        }

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token has expired.");
        }

        User user = verificationToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);

        return ResponseEntity.ok("Password set successfully.");
    }
}

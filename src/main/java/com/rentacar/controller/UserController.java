package com.rentacar.controller;

import com.rentacar.dto.DeleteAccountRequest;
import com.rentacar.dto.SetPasswordRequest;
import com.rentacar.dto.UserDTO;
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
import java.util.Map;


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
}

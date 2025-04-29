package com.rentacar.service;

import com.rentacar.dto.UserDTO;
import com.rentacar.model.User;
import com.rentacar.model.VerificationToken;
import com.rentacar.repository.UserRepository;
import com.rentacar.repository.VerificationTokenRepository;
import com.rentacar.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationToken tokenRepository;

    @Autowired
    private EmailService emailService;

    public User registerUser(UserDTO userDTO) throws Exception {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new Exception("Email is already in use");
        }

        // Kullanıcıyı şifresiz ve pasif şekilde oluştur
        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setBirthDate(userDTO.getBirthDate());
        user.setBirthPlaceCity(userDTO.getBirthPlaceCity());
        user.setBirthPlaceCountry(userDTO.getBirthPlaceCountry());
        user.setGender(userDTO.getGender());
        user.setAddress(userDTO.getAddress());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
        user.setEnabled(false); // şifre belirlenene kadar pasif

        User savedUser = userRepository.save(user);

        // Doğrulama token'ı oluştur
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, savedUser);
        tokenRepository.save(verificationToken);

        // Doğrulama e-postası gönder
        String confirmationLink = "http://localhost:3000/set-password?token=" + token;
        emailService.send(
                user.getEmail(),
                "Set Your Password",
                "Click the following link to set your password: " + confirmationLink
        );

        return savedUser;
    }

    public void deleteAccount(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));

        if (user.getPassword() == null) {
            throw new Exception("User does not have a password set yet.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Incorrect password");
        }

        userRepository.delete(user);
    }
}

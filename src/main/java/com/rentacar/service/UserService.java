package com.rentacar.service;

import com.rentacar.dto.UserDTO;
import com.rentacar.model.User;
import com.rentacar.model.VerificationToken;
import com.rentacar.repository.UserRepository;
import com.rentacar.repository.VerificationTokenRepository;
import com.rentacar.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

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
        emailService.sendVerificationLink(
                user.getEmail(),
                token
                
        );

        return savedUser;
    }
    public boolean deleteUserByEmail(String email, String rawPassword) {
        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty()) return false;
        User user = optUser.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) return false;
        userRepository.delete(user);
        return true;
    }
}

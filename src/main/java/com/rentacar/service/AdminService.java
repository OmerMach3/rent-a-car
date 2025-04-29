package com.rentacar.service;

import com.rentacar.dto.LoginRequest;
import com.rentacar.dto.LoginResponse;
import com.rentacar.model.Admin;
import com.rentacar.repository.AdminRepository;
import com.rentacar.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse authenticateAdmin(LoginRequest loginRequest) {
        // Loglama - kontrol amaçlı
        System.out.println("🟡 Kullanıcı adı: " + loginRequest.getUsername());
        System.out.println("🟡 Girilen şifre: " + loginRequest.getPassword());

        // Veritabanından kullanıcıyı bul
        Admin admin = adminRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Şifre eşleşiyor mu kontrol et
        boolean match = passwordEncoder.matches(loginRequest.getPassword(), admin.getPasswordHash());
        System.out.println("✅ Şifre eşleşti mi? " + match);

        if (!match) {
            throw new RuntimeException("Şifre eşleşmedi");
        }

        // Doğrulama işlemi
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

       return new LoginResponse(jwt, admin.getUsername(), admin.getRole().name());
    }
}

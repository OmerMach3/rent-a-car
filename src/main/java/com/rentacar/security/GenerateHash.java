package com.rentacar.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        String rawPassword = "password123";
        String encoded = new BCryptPasswordEncoder().encode(rawPassword);
        System.out.println("✅ Yeni sağlam hash: " + encoded);
    }
}

 
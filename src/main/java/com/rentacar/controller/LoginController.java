package com.rentacar.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
    @PostMapping("/api/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        if ("ornek@eposta.com".equals(loginRequest.getEmail()) && "123456".equals(loginRequest.getPassword()))
            return "token_ornegi";
        return "Hatalı giriş";
    }
}

package com.rentacar.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

// TEMPORARILY DISABLED - Using only SecurityConfig.java to avoid conflicts
/*
@Configuration
@EnableWebSecurity
@Order(102) // Farklı bir sıra numarası
public class UserSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/user/**").permitAll()
            .antMatchers("/api/login").permitAll() // Bu satırı ekleyin!
            .anyRequest().authenticated();
    }
}
*/

// This configuration is temporarily disabled to avoid conflicts with SecurityConfig.java
// All security rules are now handled in SecurityConfig.java
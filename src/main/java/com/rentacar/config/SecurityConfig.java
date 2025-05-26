package com.rentacar.config;

import com.rentacar.security.AdminDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@Order(101)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AdminDetailsServiceImpl adminDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(adminDetailsService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        .cors().and().csrf().disable() // CORS filtresini etkinleştir ve CSRF'yi kapat
        .authorizeRequests()
            // Public endpoints - no authentication required
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers("/api/login").permitAll() // Admin giriş için izin ver
            .antMatchers("/api/user/login").permitAll() // End user giriş için izin ver
            .antMatchers("/api/user/logout").permitAll() // End user çıkış için izin ver
            .antMatchers("/api/user/register").permitAll() // User registration
            .antMatchers("/api/user/deleteAccount").permitAll() // Account deletion
            .antMatchers("/api/user/set-password").permitAll() // Password setting
            
            // FIXED: Allow user profile access for authenticated users
            .antMatchers("/api/user/profile/**").permitAll() // User profile endpoints
            .antMatchers("/api/user/profile").permitAll() // User profile by email
            
            // Car endpoints - for testing, make accessible
            .antMatchers("/api/cars/**").permitAll() // Car management endpoints
            
            // All other user endpoints require authentication
            .antMatchers("/api/user/**").permitAll() // TEMPORARILY allow all user endpoints
            
            // Everything else requires authentication
            .anyRequest().authenticated()
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Frontend origin
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true); // Allow credentials
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // Expose auth headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
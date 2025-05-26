package com.rentacar.repository;

import com.rentacar.model.User;
import com.rentacar.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    List<VerificationToken> findByUser(User user);
}
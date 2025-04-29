package com.rentacar.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String birthPlaceCountry;
    private String birthPlaceCity;
    private String gender;
    private String address;
    private String phoneNumber;

    @Column(unique = true)
    private String email;

    private String password;

    private boolean enabled = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}


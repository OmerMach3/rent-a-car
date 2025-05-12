package com.rentacar.repository;

import com.rentacar.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    
    Optional<Car> findByLicensePlate(String licensePlate);
    
    List<Car> findByMakeContainingIgnoreCase(String make);
    
    List<Car> findByStatus(Car.Status status);
    
    boolean existsByLicensePlate(String licensePlate);
}
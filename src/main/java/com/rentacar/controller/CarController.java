package com.rentacar.controller;

import com.rentacar.dto.CarDTO;
import com.rentacar.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:3000")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        try {
            CarDTO car = carService.getCarById(id);
            return ResponseEntity.ok(car);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCar(@Valid @RequestBody CarDTO carDTO) {
        try {
        CarDTO createdCar = carService.createCar(carDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Car created successfully!");
        response.put("car", createdCar);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    } catch (IllegalArgumentException e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    } catch (Exception e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "An unexpected error occurred: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @Valid @RequestBody CarDTO carDTO) {
        try {
            CarDTO updatedCar = carService.updateCar(id, carDTO);
            return ResponseEntity.ok(updatedCar);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

  

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteCar(@PathVariable Long id) {
    try {
        carService.deleteCar(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Car deleted successfully");
        
        return ResponseEntity.ok(response);
    } catch (EntityNotFoundException e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    } catch (IllegalStateException e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    } catch (Exception e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "An unexpected error occurred: " + e.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
    

    @GetMapping("/available")
    public ResponseEntity<List<CarDTO>> getAvailableCars() {
        List<CarDTO> availableCars = carService.getAvailableCars();
        return ResponseEntity.ok(availableCars);
    }
}
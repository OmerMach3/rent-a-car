package com.rentacar.service;

import com.rentacar.dto.CarDTO;
import com.rentacar.model.Car;
import com.rentacar.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<CarDTO> getAllCars() {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Car not found with id: " + id));
        return convertToDTO(car);
    }

    public CarDTO createCar(CarDTO carDTO) {
        // Check if license plate already exists
        if (carRepository.existsByLicensePlate(carDTO.getLicensePlate())) {
            throw new IllegalArgumentException("A car with this license plate already exists");
        }

        Car car = convertToEntity(carDTO);
        Car savedCar = carRepository.save(car);
        return convertToDTO(savedCar);
    }

    public CarDTO updateCar(Long id, CarDTO carDTO) {
        Car existingCar = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Car not found with id: " + id));

        // Check if license plate is already in use by another car
        if (!existingCar.getLicensePlate().equals(carDTO.getLicensePlate()) &&
                carRepository.existsByLicensePlate(carDTO.getLicensePlate())) {
            throw new IllegalArgumentException("A car with this license plate already exists");
        }

        // Update fields
        existingCar.setMake(carDTO.getMake());
        existingCar.setModel(carDTO.getModel());
        existingCar.setYear(carDTO.getYear());
        existingCar.setColor(carDTO.getColor());
        existingCar.setLicensePlate(carDTO.getLicensePlate());
        existingCar.setVinNumber(carDTO.getVinNumber());
        existingCar.setMileage(carDTO.getMileage());
        existingCar.setFuelType(carDTO.getFuelType());
        existingCar.setTransmission(carDTO.getTransmission());
        existingCar.setCategory(carDTO.getCategory());
        existingCar.setDailyRate(carDTO.getDailyRate());
        existingCar.setStatus(carDTO.getStatus());
        existingCar.setFeatures(carDTO.getFeatures());
        existingCar.setDescription(carDTO.getDescription());
        existingCar.setLastMaintenanceDate(carDTO.getLastMaintenanceDate());
        existingCar.setNextMaintenanceDate(carDTO.getNextMaintenanceDate());

        Car updatedCar = carRepository.save(existingCar);
        return convertToDTO(updatedCar);
    }

    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new EntityNotFoundException("Car not found with id: " + id);
        }
        carRepository.deleteById(id);
    }

    public List<CarDTO> getAvailableCars() {
        List<Car> availableCars = carRepository.findByStatus(Car.Status.AVAILABLE);
        return availableCars.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper methods to convert between DTO and Entity
    private CarDTO convertToDTO(Car car) {
        CarDTO carDTO = new CarDTO();
        carDTO.setId(car.getId());
        carDTO.setMake(car.getMake());
        carDTO.setModel(car.getModel());
        carDTO.setYear(car.getYear());
        carDTO.setColor(car.getColor());
        carDTO.setLicensePlate(car.getLicensePlate());
        carDTO.setVinNumber(car.getVinNumber());
        carDTO.setMileage(car.getMileage());
        carDTO.setFuelType(car.getFuelType());
        carDTO.setTransmission(car.getTransmission());
        carDTO.setCategory(car.getCategory());
        carDTO.setDailyRate(car.getDailyRate());
        carDTO.setStatus(car.getStatus());
        carDTO.setFeatures(car.getFeatures());
        carDTO.setDescription(car.getDescription());
        carDTO.setLastMaintenanceDate(car.getLastMaintenanceDate());
        carDTO.setNextMaintenanceDate(car.getNextMaintenanceDate());
        return carDTO;
    }

    private Car convertToEntity(CarDTO carDTO) {
        Car car = new Car();
        // Skip setting ID for new entities
        if (carDTO.getId() != null) {
            car.setId(carDTO.getId());
        }
        car.setMake(carDTO.getMake());
        car.setModel(carDTO.getModel());
        car.setYear(carDTO.getYear());
        car.setColor(carDTO.getColor());
        car.setLicensePlate(carDTO.getLicensePlate());
        car.setVinNumber(carDTO.getVinNumber());
        car.setMileage(carDTO.getMileage());
        car.setFuelType(carDTO.getFuelType());
        car.setTransmission(carDTO.getTransmission());
        car.setCategory(carDTO.getCategory());
        car.setDailyRate(carDTO.getDailyRate());
        car.setStatus(carDTO.getStatus());
        car.setFeatures(carDTO.getFeatures());
        car.setDescription(carDTO.getDescription());
        car.setLastMaintenanceDate(carDTO.getLastMaintenanceDate());
        car.setNextMaintenanceDate(carDTO.getNextMaintenanceDate());
        return car;
    }
}
package com.rentacar.config;

import com.rentacar.model.Admin;
import com.rentacar.model.Car;
import com.rentacar.repository.AdminRepository;
import com.rentacar.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CarRepository carRepository;

    @Override
    public void run(String... args) throws Exception {
         initializeAdmin();
        // Check if cars already exist
        if (carRepository.count() == 0) {
            initializeCars();
        }
    }
    @Autowired
private AdminRepository adminRepository;
@Autowired
private PasswordEncoder passwordEncoder;

private void initializeAdmin() {
    if (adminRepository.count() == 0) {
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole(Admin.Role.SYSTEM_ADMIN);
        adminRepository.save(admin);
        System.out.println("Admin user created! Username: admin, Password: admin123");
    }
}

    private void initializeCars() {
        // Create sample cars
        Car car1 = new Car();
        car1.setMake("Toyota");
        car1.setModel("Corolla");
        car1.setYear(2023);
        car1.setColor("Silver");
        car1.setLicensePlate("ABC-123");
        car1.setVinNumber("1HGCM82633A123456");
        car1.setMileage(5000);
        car1.setFuelType("GASOLINE");
        car1.setTransmission(Car.Transmission.AUTOMATIC);
        car1.setCategory(Car.Category.ECONOMY);
        car1.setDailyRate(new BigDecimal("50.00"));
        car1.setStatus(Car.Status.AVAILABLE);
        car1.setFeatures(Arrays.asList("Bluetooth", "Air Conditioning", "Backup Camera"));
        car1.setDescription("Reliable and fuel-efficient compact sedan, perfect for city driving.");
        car1.setLastMaintenanceDate(LocalDate.now().minusMonths(1));
        car1.setNextMaintenanceDate(LocalDate.now().plusMonths(5));

        Car car2 = new Car();
        car2.setMake("Honda");
        car2.setModel("CR-V");
        car2.setYear(2022);
        car2.setColor("Blue");
        car2.setLicensePlate("XYZ-789");
        car2.setVinNumber("2HNYD28478H456789");
        car2.setMileage(12000);
        car2.setFuelType("GASOLINE");
        car2.setTransmission(Car.Transmission.AUTOMATIC);
        car2.setCategory(Car.Category.SUV);
        car2.setDailyRate(new BigDecimal("75.00"));
        car2.setStatus(Car.Status.AVAILABLE);
        car2.setFeatures(Arrays.asList("GPS", "Bluetooth", "Air Conditioning", "Backup Camera", "Sunroof"));
        car2.setDescription("Spacious SUV with excellent safety features, great for family trips.");
        car2.setLastMaintenanceDate(LocalDate.now().minusMonths(2));
        car2.setNextMaintenanceDate(LocalDate.now().plusMonths(4));

        Car car3 = new Car();
        car3.setMake("BMW");
        car3.setModel("5 Series");
        car3.setYear(2022);
        car3.setColor("Black");
        car3.setLicensePlate("LUX-500");
        car3.setVinNumber("WBAAA1305H8251545");
        car3.setMileage(8000);
        car3.setFuelType("GASOLINE");
        car3.setTransmission(Car.Transmission.AUTOMATIC);
        car3.setCategory(Car.Category.LUXURY);
        car3.setDailyRate(new BigDecimal("120.00"));
        car3.setStatus(Car.Status.MAINTENANCE);
        car3.setFeatures(Arrays.asList("GPS", "Bluetooth", "Air Conditioning", "Leather Seats", "Sunroof", "Heated Seats", "Cruise Control"));
        car3.setDescription("Luxurious sedan with premium features and dynamic driving performance.");
        car3.setLastMaintenanceDate(LocalDate.now().minusMonths(3));
        car3.setNextMaintenanceDate(LocalDate.now().plusMonths(3));

        Car car4 = new Car();
        car4.setMake("Ford");
        car4.setModel("Transit");
        car4.setYear(2021);
        car4.setColor("White");
        car4.setLicensePlate("VAN-123");
        car4.setVinNumber("1FTNS24W83HB12345");
        car4.setMileage(25000);
        car4.setFuelType("DIESEL");
        car4.setTransmission(Car.Transmission.MANUAL);
        car4.setCategory(Car.Category.VAN);
        car4.setDailyRate(new BigDecimal("90.00"));
        car4.setStatus(Car.Status.RENTED);
        car4.setFeatures(Arrays.asList("Bluetooth", "Air Conditioning", "Backup Camera"));
        car4.setDescription("Spacious cargo van, perfect for moving or business use.");
        car4.setLastMaintenanceDate(LocalDate.now().minusMonths(1));
        car4.setNextMaintenanceDate(LocalDate.now().plusMonths(2));

        Car car5 = new Car();
        car5.setMake("Nissan");
        car5.setModel("Leaf");
        car5.setYear(2023);
        car5.setColor("Green");
        car5.setLicensePlate("EV-1000");
        car5.setVinNumber("1N4AZ1CP8LC123456");
        car5.setMileage(3000);
        car5.setFuelType("ELECTRIC");
        car5.setTransmission(Car.Transmission.AUTOMATIC);
        car5.setCategory(Car.Category.ECONOMY);
        car5.setDailyRate(new BigDecimal("65.00"));
        car5.setStatus(Car.Status.AVAILABLE);
        car5.setFeatures(Arrays.asList("GPS", "Bluetooth", "Air Conditioning", "Backup Camera", "Cruise Control"));
        car5.setDescription("100% electric vehicle with zero emissions, ideal for eco-conscious drivers.");
        car5.setLastMaintenanceDate(LocalDate.now().minusMonths(2));
        car5.setNextMaintenanceDate(LocalDate.now().plusMonths(6));

        // Save all cars
        List<Car> cars = Arrays.asList(car1, car2, car3, car4, car5);
        carRepository.saveAll(cars);
        
        System.out.println("Sample car data initialized!");
    }
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddCarPage.css";

const AddCarPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    vinNumber: "",
    mileage: "",
    fuelType: "",
    transmission: "AUTOMATIC",
    category: "ECONOMY",
    dailyRate: "",
    status: "AVAILABLE",
    features: [],
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "SYSTEM_ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        features: [...formData.features, value],
      });
    } else {
      setFormData({
        ...formData,
        features: formData.features.filter((feature) => feature !== value),
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.make) newErrors.make = "Make is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.licensePlate)
      newErrors.licensePlate = "License plate is required";
    if (!formData.dailyRate) newErrors.dailyRate = "Daily rate is required";

    // Validate year is a number between 1900 and current year + 1
    const currentYear = new Date().getFullYear();
    if (
      formData.year &&
      (isNaN(formData.year) ||
        formData.year < 1900 ||
        formData.year > currentYear + 1)
    ) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }

    // Validate daily rate is a positive number
    if (
      formData.dailyRate &&
      (isNaN(formData.dailyRate) || formData.dailyRate <= 0)
    ) {
      newErrors.dailyRate = "Daily rate must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8081/api/cars", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setLoading(false);

      // Redirect to car listing page after 2 seconds
      setTimeout(() => {
        navigate("/cars");
      }, 2000);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        setErrors({
          submit:
            error.response.data.message ||
            "Failed to add car. Please try again.",
        });
      } else {
        setErrors({ submit: "An error occurred while adding the car." });
      }
    }
  };

  const cancelForm = () => {
    navigate("/cars");
  };

  return (
    <div className="add-car-container">
      <h2>Add New Car</h2>

      {success && (
        <div className="success-message">Car has been successfully added!</div>
      )}

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="make">Make *</label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className={errors.make ? "error" : ""}
              />
              {errors.make && <span className="error-text">{errors.make}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={errors.model ? "error" : ""}
              />
              {errors.model && (
                <span className="error-text">{errors.model}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={errors.year ? "error" : ""}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <span className="error-text">{errors.year}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="licensePlate">License Plate *</label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className={errors.licensePlate ? "error" : ""}
              />
              {errors.licensePlate && (
                <span className="error-text">{errors.licensePlate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="vinNumber">VIN Number</label>
              <input
                type="text"
                id="vinNumber"
                name="vinNumber"
                value={formData.vinNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label htmlFor="mileage">Mileage</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type</label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <option value="GASOLINE">Gasoline</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transmission">Transmission</label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
                <option value="SEMI_AUTOMATIC">Semi-Automatic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="ECONOMY">Economy</option>
                <option value="COMPACT">Compact</option>
                <option value="MID_SIZE">Mid-Size</option>
                <option value="FULL_SIZE">Full-Size</option>
                <option value="SUV">SUV</option>
                <option value="LUXURY">Luxury</option>
                <option value="VAN">Van</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dailyRate">Daily Rate (USD) *</label>
              <input
                type="number"
                id="dailyRate"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                className={errors.dailyRate ? "error" : ""}
                min="0"
                step="0.01"
              />
              {errors.dailyRate && (
                <span className="error-text">{errors.dailyRate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RENTED">Rented</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group features-section">
          <label>Features</label>
          <div className="feature-checkboxes">
            {[
              "GPS",
              "Bluetooth",
              "Air Conditioning",
              "Leather Seats",
              "Cruise Control",
              "Backup Camera",
              "Sunroof",
              "Heated Seats",
            ].map((feature) => (
              <div key={feature} className="feature-checkbox">
                <input
                  type="checkbox"
                  id={`feature-${feature}`}
                  value={feature}
                  checked={formData.features.includes(feature)}
                  onChange={handleFeatureChange}
                />
                <label htmlFor={`feature-${feature}`}>{feature}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={cancelForm}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Adding..." : "Add Car"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCarPage;

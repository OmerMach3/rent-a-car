import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./AddCarPage.css";

const AddCarPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get car ID from URL params for edit mode
  const isEditMode = !!id; // Check if we're in edit mode

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
    lastMaintenanceDate: "", // Added this field
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchingCar, setFetchingCar] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "SYSTEM_ADMIN") {
      navigate("/login");
      return;
    }

    // If in edit mode, fetch the car data
    if (isEditMode) {
      fetchCarData();
    }
  }, [navigate, isEditMode, id]);

  const fetchCarData = async () => {
    try {
      setFetchingCar(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8081/api/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const carData = response.data;

      // Format the date if it exists
      const formattedDate = carData.lastMaintenanceDate
        ? new Date(carData.lastMaintenanceDate).toISOString().split("T")[0]
        : "";

      setFormData({
        make: carData.make || "",
        model: carData.model || "",
        year: carData.year || "",
        color: carData.color || "",
        licensePlate: carData.licensePlate || "",
        vinNumber: carData.vinNumber || "",
        mileage: carData.mileage || "",
        fuelType: carData.fuelType || "",
        transmission: carData.transmission || "AUTOMATIC",
        category: carData.category || "ECONOMY",
        dailyRate: carData.dailyRate || "",
        status: carData.status || "AVAILABLE",
        features: carData.features || [],
        description: carData.description || "",
        lastMaintenanceDate: formattedDate,
      });

      setFetchingCar(false);
    } catch (error) {
      console.error("Failed to fetch car data:", error);
      setErrors({
        submit: "Failed to load car data. Please try again.",
      });
      setFetchingCar(false);
    }
  };

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

    // Required fields
    if (!formData.make) newErrors.make = "Make is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.licensePlate)
      newErrors.licensePlate = "License plate is required";
    if (!formData.dailyRate) newErrors.dailyRate = "Daily rate is required";

    // Year validation
    const currentYear = new Date().getFullYear() + 1;
    if (
      formData.year &&
      (isNaN(formData.year) ||
        formData.year < 1900 ||
        formData.year > currentYear)
    ) {
      newErrors.year = `Year must be between 1900 and ${currentYear}`;
    }

    // Daily rate validation
    if (
      formData.dailyRate &&
      (isNaN(formData.dailyRate) || parseFloat(formData.dailyRate) <= 0)
    ) {
      newErrors.dailyRate = "Daily rate must be a positive number";
    }

    // License plate validation
    if (
      formData.licensePlate &&
      !/^[A-Z0-9-]{2,10}$/.test(formData.licensePlate)
    ) {
      newErrors.licensePlate = "Invalid license plate format";
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

      // Prepare data for submission
      const submitData = { ...formData };

      // Convert lastMaintenanceDate to proper format if provided
      if (submitData.lastMaintenanceDate) {
        submitData.lastMaintenanceDate = new Date(
          submitData.lastMaintenanceDate
        ).toISOString();
      } else {
        delete submitData.lastMaintenanceDate; // Don't send empty date
      }

      let response;
      if (isEditMode) {
        // Update existing car
        response = await axios.put(
          `http://localhost:8081/api/cars/${id}`,
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new car
        response = await axios.post(
          "http://localhost:8081/api/cars",
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setSuccess(true);
      setLoading(false);

      // Reset form if adding new car
      if (!isEditMode) {
        setFormData({
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
          lastMaintenanceDate: "",
        });
      }

      // Redirect to car listing page after 2 seconds
      setTimeout(() => {
        navigate("/cars");
      }, 2000);
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setErrors({
            submit: error.response.data.message,
          });
        } else {
          setErrors({
            submit: `Failed to ${
              isEditMode ? "update" : "add"
            } car. Please try again.`,
          });
        }
      } else {
        setErrors({
          submit: `An error occurred while ${
            isEditMode ? "updating" : "adding"
          } the car.`,
        });
      }
    }
  };

  const cancelForm = () => {
    navigate("/cars");
  };

  if (fetchingCar) {
    return (
      <div className="add-car-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading car data...
        </div>
      </div>
    );
  }

  return (
    <div className="add-car-container">
      <h2>{isEditMode ? "Edit Car" : "Add New Car"}</h2>

      {success && (
        <div className="success-message">
          Car has been successfully {isEditMode ? "updated" : "added"}!
        </div>
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

            <div className="form-group">
              <label htmlFor="lastMaintenanceDate">Last Maintenance Date</label>
              <input
                type="date"
                id="lastMaintenanceDate"
                name="lastMaintenanceDate"
                value={formData.lastMaintenanceDate}
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
                <option value="">Select Fuel Type</option>
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
            {loading
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
              ? "Update Car"
              : "Add Car"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCarPage;

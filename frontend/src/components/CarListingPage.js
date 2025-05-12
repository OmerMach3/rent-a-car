import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CarListingPage.css";

function CarListingPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "SYSTEM_ADMIN") {
      navigate("/login");
      return;
    }

    // Fetch car list from API
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8081/api/cars", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setError("Failed to load cars. Please try again later.");
        setLoading(false);
      }
    };

    fetchCars();
  }, [navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="car-listing-container">
      <div className="car-listing-header">
        <h2>Car Listing</h2>
        <button className="add-car-button" onClick={() => navigate("/add-car")}>
          Add New Car
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Loading cars...</div>
      ) : (
        <>
          {cars.length === 0 ? (
            <div className="no-cars-message">
              No cars found. Click "Add New Car" to create a new car record.
            </div>
          ) : (
            <div className="car-table-container">
              <table className="car-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>License Plate</th>
                    <th>Status</th>
                    <th>Daily Rate</th>
                    <th>Last Maintenance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id}>
                      <td>{car.id}</td>
                      <td>{car.make}</td>
                      <td>{car.model}</td>
                      <td>{car.year}</td>
                      <td>{car.licensePlate}</td>
                      <td>
                        <span
                          className={`status-badge ${car.status.toLowerCase()}`}
                        >
                          {car.status}
                        </span>
                      </td>
                      <td>${car.dailyRate.toFixed(2)}</td>
                      <td>{formatDate(car.lastMaintenanceDate)}</td>
                      <td className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => navigate(`/edit-car/${car.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="details-button"
                          onClick={() => navigate(`/car-details/${car.id}`)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CarListingPage;

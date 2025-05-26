import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CarListingPage.css";

function CarListingPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Silme işlemi için state'ler
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

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
        console.log("Fetched cars:", response.data);
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

  // Silme modalını göster
  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  // Silme modalını kapat
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCar(null);
    setDeleteError("");
  };

  // Silme işlemini gerçekleştir
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");

      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8081/api/cars/${selectedCar.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeleteLoading(false);
      setDeleteSuccess("Car successfully deleted");

      // Araba listesini güncelle
      setCars(cars.filter((car) => car.id !== selectedCar.id));

      // 2 saniye bekle ve modal'ı kapat
      setTimeout(() => {
        setShowDeleteModal(false);
        setSelectedCar(null);
        setDeleteSuccess("");
      }, 2000);
    } catch (err) {
      setDeleteLoading(false);

      if (err.response && err.response.data) {
        // Status 409 (Conflict) - Araba kiralanmış
        if (err.response.status === 409) {
          setDeleteError(
            err.response.data.message ||
              "This car cannot be deleted because it is currently rented."
          );
        }
        // Status 404 (Not Found) - Araba bulunamadı
        else if (err.response.status === 404) {
          setDeleteError(err.response.data.message || "Car not found.");
        }
        // Diğer hatalar
        else {
          setDeleteError(
            err.response.data.message ||
              "An error occurred while deleting the car."
          );
        }
      } else {
        setDeleteError("An unexpected error occurred. Please try again.");
      }
    }
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
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteClick(car)}
                        >
                          Delete
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

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete {selectedCar.year}{" "}
              {selectedCar.make} {selectedCar.model} ({selectedCar.licensePlate}
              )?
              {selectedCar.status === "RENTED" && (
                <span className="warning-text">
                  Warning: This car is currently rented and cannot be deleted.
                </span>
              )}
            </p>

            {deleteError && <div className="error-message">{deleteError}</div>}
            {deleteSuccess && (
              <div className="success-message">{deleteSuccess}</div>
            )}

            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={handleCloseDeleteModal}
                disabled={deleteLoading || deleteSuccess}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-button"
                onClick={handleConfirmDelete}
                disabled={
                  deleteLoading ||
                  deleteSuccess ||
                  selectedCar.status === "RENTED"
                }
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarListingPage;

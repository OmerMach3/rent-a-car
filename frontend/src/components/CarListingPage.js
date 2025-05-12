import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CarDetailsPage.css";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Silme işlemi için state'ler
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

    // Fetch car details
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8081/api/cars/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCar(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError("Failed to load car details. Please try again later.");
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleEditClick = () => {
    navigate(`/edit-car/${id}`);
  };

  const handleBackClick = () => {
    navigate("/cars");
  };

  // Silme modalını göster
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  // Silme modalını kapat
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Silme işlemini gerçekleştir
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");

      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8081/api/cars/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeleteLoading(false);
      setDeleteSuccess("Car successfully deleted");

      // 2 saniye bekle ve araçlar listesine geri dön
      setTimeout(() => {
        navigate("/cars");
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

  if (loading) {
    return <div className="car-details-loading">Loading car details...</div>;
  }

  if (error) {
    return (
      <div className="car-details-error">
        <p>{error}</p>
        <button onClick={handleBackClick}>Back to Car List</button>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="car-details-not-found">
        <p>Car not found.</p>
        <button onClick={handleBackClick}>Back to Car List</button>
      </div>
    );
  }

  return (
    <div className="car-details-container">
      <div className="car-details-header">
        <h2>Car Details</h2>
        <div className="car-details-actions">
          <button className="edit-car-button" onClick={handleEditClick}>
            Edit Car
          </button>
          <button className="delete-car-button" onClick={handleDeleteClick}>
            Delete Car
          </button>
          <button className="back-button" onClick={handleBackClick}>
            Back to List
          </button>
        </div>
      </div>

      <div className="car-details-content">
        <div className="car-details-main">
          <div className="car-image-placeholder">
            <span>Car Image Not Available</span>
          </div>

          <div className="car-info-primary">
            <h3>
              {car.year} {car.make} {car.model}
            </h3>
            <div className="car-status">
              <span className={`status-badge ${car.status.toLowerCase()}`}>
                {car.status}
              </span>
            </div>
            <p className="car-price">${car.dailyRate.toFixed(2)} / day</p>
            <p className="car-description">
              {car.description || "No description available."}
            </p>
          </div>
        </div>

        <div className="car-details-grid">
          <div className="detail-section">
            <h4>Basic Information</h4>
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{car.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">License Plate:</span>
              <span className="detail-value">{car.licensePlate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">VIN:</span>
              <span className="detail-value">{car.vinNumber || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Color:</span>
              <span className="detail-value">{car.color || "N/A"}</span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Technical Details</h4>
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{car.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Transmission:</span>
              <span className="detail-value">{car.transmission}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fuel Type:</span>
              <span className="detail-value">{car.fuelType || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Mileage:</span>
              <span className="detail-value">
                {car.mileage ? `${car.mileage} km` : "N/A"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Maintenance</h4>
            <div className="detail-item">
              <span className="detail-label">Last Maintenance:</span>
              <span className="detail-value">
                {formatDate(car.lastMaintenanceDate)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Next Maintenance Due:</span>
              <span className="detail-value">
                {formatDate(car.nextMaintenanceDate)}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Features</h4>
            {car.features && car.features.length > 0 ? (
              <div className="features-list">
                {car.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-check">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No features listed</p>
            )}
          </div>
        </div>
      </div>

      {/* Silme onay modalı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete {car.year} {car.make} {car.model}{" "}
              ({car.licensePlate})?
              {car.status === "RENTED" && (
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
                  deleteLoading || deleteSuccess || car.status === "RENTED"
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
};

export default CarDetailsPage;

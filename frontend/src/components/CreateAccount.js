// src/components/UserRegistration.jsx
import React, { useState } from "react";
import axios from "axios";
import "./CreateAccount.css";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlaceCountry: "",
    birthPlaceCity: "",
    gender: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.birthDate) newErrors.birthDate = "Birth Date is required";
    if (!formData.birthPlaceCountry)
      newErrors.birthPlaceCountry = "Birth Place Country is required";
    if (!formData.birthPlaceCity)
      newErrors.birthPlaceCity = "Birth Place City is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.email) newErrors.email = "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:8081/api/user/register",
          formData
        );

        setSuccessMessage("Authentication mail sent. Please check your inbox.");
        setEmailSent(true);

        setFormData({
          firstName: "",
          lastName: "",
          birthDate: "",
          birthPlaceCountry: "",
          birthPlaceCity: "",
          gender: "",
          address: "",
          phoneNumber: "",
          email: "",
        });
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({
            submit:
              error.response.data.message ||
              "Registration failed. Please try again.",
          });
        } else {
          setErrors({ submit: "Registration failed. Please try again." });
        }
      }
    }
  };

  return (
    <div className="registration-container">
      <h2>Create Account</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        {[
          { label: "First Name", name: "firstName" },
          { label: "Last Name", name: "lastName" },
          { label: "Birth Date", name: "birthDate", type: "date" },
          { label: "Birth Place Country", name: "birthPlaceCountry" },
          { label: "Birth Place City", name: "birthPlaceCity" },
          { label: "Address", name: "address", textarea: true },
          { label: "Phone Number", name: "phoneNumber", type: "tel" },
          { label: "Email", name: "email", type: "email" },
        ].map(({ label, name, type = "text", textarea }) => (
          <div key={name} className="form-group">
            <label>{label} *</label>
            {textarea ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={errors[name] ? "error" : ""}
              />
            )}
            {errors[name] && <span className="error-text">{errors[name]}</span>}
          </div>
        ))}

        <div className="form-group">
          <label>Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={errors.gender ? "error" : ""}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;

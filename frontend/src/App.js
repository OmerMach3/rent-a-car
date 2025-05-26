import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import DeleteAccount from "./components/DeleteAccount";
import CreateAccount from "./components/CreateAccount";
import SetPassword from "./components/SetPassword";
import CarListingPage from "./components/CarListingPage";
import AddCarPage from "./components/AddCarPage";
import CarDetailsPage from "./components/CarDetailsPage";
import EndUserLoginPage from "./components/EndUserLogin"; // New import
import UserProfileViewPage from "./components/ProfileViewPage"; // New import
import UserProfilePage from "./components/UserProfilePage"; // New import
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ana Sayfaya Yönlendirme */}
          <Route path="/" element={<Navigate to="/home" />} />
          {/* Giriş Sayfaları */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-login" element={<EndUserLoginPage />} />{" "}
          {/* New route */}
          {/* Ana Sayfa */}
          <Route path="/home" element={<HomePage />} />
          {/* Hesap Oluşturma */}
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/set-password" element={<SetPassword />} />
          {/* Hesap Silme */}
          {/* User Profile Routes - New routes */}
          <Route path="/user-profile" element={<UserProfileViewPage />} />
          <Route path="/update-profile" element={<UserProfilePage />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          {/* Araç Yönetimi */}
          <Route path="/cars" element={<CarListingPage />} />
          <Route path="/add-car" element={<AddCarPage />} />
          <Route path="/car-details/:id" element={<CarDetailsPage />} />
          <Route path="/edit-car/:id" element={<AddCarPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

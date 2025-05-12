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
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ana Sayfaya Yönlendirme */}
          <Route path="/" element={<Navigate to="/home" />} />

          {/* Giriş Sayfası */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ana Sayfa */}
          <Route path="/home" element={<HomePage />} />

          {/* Hesap Oluşturma */}
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* Hesap Silme */}
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

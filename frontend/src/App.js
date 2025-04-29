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

          {/* Hesap Silme */}
          <Route path="/delete-account" element={<DeleteAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

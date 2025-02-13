import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import EmployeeLogin from "./pages/EmployeeLogin";
// Add this if you have a Dashboard page
import "bootstrap/dist/css/bootstrap.min.css";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDetails from "./pages/EmployeeDetails";
import EmployeeUpdate from "./pages/EmployeeUpdate";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import "./App.css";

// ✅ Check if admin is logged in
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("admin"); // Check localStorage
  return isAuthenticated ? element : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <div className="container mt-5">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin/update/:employeeId" element={<EmployeeUpdate />} />

        {/* 🚀 Protect Admin Dashboard Route */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} />}
        />

        {/* ✅ Route for Employee Details */}
        <Route path="/employee/:id" element={<EmployeeDetails />} />
      </Routes>
    </div>
  );
}

export default App;

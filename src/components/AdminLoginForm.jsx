import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/admin/login?email=${formData.email}&password=${formData.password}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 401) {
          throw new Error("Invalid credentials");
        } else if (response.status === 500) {
          throw new Error("Not registered. Please register.");
        } else {
          throw new Error(
            errorData?.error || "Something went wrong. Try again later."
          );
        }
      }

      const data = await response.json();
      const adminDetails = {
        adminId: data.adminId,
        fullName: data.fullName || "Admin",
        email: data.email,
      };
      localStorage.setItem("admin", JSON.stringify(adminDetails));

      navigate("/admin/dashboard");
    } catch (error) {
      if (error.message === "Failed to fetch") {
        setMessage("Server busy! Please try again later.");
      } else {
        setMessage(error.message);
      }
    }
  };

  return (
    <div className="card p-4 shadow-lg" style={{ width: "24rem" }}>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: "50px", fontWeight: "bold", color: "#333" }}>
          EMP2
        </h1>
      </div>
      <h2 className="text-center mb-4">Admin Login</h2>
      {message && <p className="alert alert-danger">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;

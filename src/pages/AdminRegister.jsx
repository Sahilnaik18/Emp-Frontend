import { useNavigate } from "react-router-dom";
import AdminRegisterForm from "../components/AdminRegisterForm";

const AdminRegister = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
      <AdminRegisterForm />

      {/* ✅ Login Link for Existing Admins */}
      <p className="mt-3">
        Already have an account?{" "}
        <span
          className="text-primary"
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/admin/login")} // ✅ Redirects to Admin Login
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default AdminRegister;

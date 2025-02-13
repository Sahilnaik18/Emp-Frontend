import { useNavigate } from "react-router-dom";
import AdminLoginForm from "../components/AdminLoginForm";

const AdminLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
      <AdminLoginForm />

      <p className="mt-3">
        If you are a new member,{" "}
        <span
          className="text-primary"
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/admin/register")}
        >
          Register here
        </span>
      </p>
      <p className="mt-2">
        Are you an employee?{" "}
        <span
          className="text-success"
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/employee-login")} // ✅ Redirects to Employee Login
        >
          Employee Login
        </span>
      </p>
    </div>
  );
};

export default AdminLogin;

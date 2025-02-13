import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthForm = ({
  title,
  fields,
  endpoint,
  method,
  queryParams = false,
  redirectText,
  redirectPath,
}) => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const requestData = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      console.log("Sending request:", requestData); // Debugging log

      const response = await fetch("http://localhost:8080/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status); // Debugging log

      if (response.status === 500) {
        throw new Error("Invalid email or password...");
      } else if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Server error: ${response.status}, Message: ${errorData}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      setMessage("Login Successful");

      // Store user data
      localStorage.setItem("user", JSON.stringify(data));

      // Delay before navigating
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
      <div className="text-center mb-4">
        <h1 style={{ fontSize: "50px", fontWeight: "bold", color: "#333" }}>
          EMP2
        </h1>
      </div>
      <div className="card p-4 shadow-lg" style={{ width: "24rem" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">{title}</h2>
          {message && (
            <p
              className={`alert ${
                message.includes("error") ? "alert-danger" : "alert-info"
              }`}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  className="form-control"
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
          <p className="text-center mt-3">
            {redirectText}{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(redirectPath)}
            >
              Click here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

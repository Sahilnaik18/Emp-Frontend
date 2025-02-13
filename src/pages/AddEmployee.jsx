import { useState } from "react";

const AddEmployee = ({ onEmployeeAdded }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setValidationError("");

    // Validate inputs
    if (!validateEmail(email)) {
      setValidationError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      const response = await fetch(
        `http://localhost:8080/admin/employee?adminId=${admin.adminId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email }),
        }
      );

      if (!response.ok) throw new Error("Failed to add employee");

      setSuccess(true);
      setFullName("");
      setEmail("");
      onEmployeeAdded();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Employee</h2>
      {validationError && <p style={styles.error}>{validationError}</p>}
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
          required
          style={styles.input}
        />

        <label style={styles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter valid email"
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading
            ? "Adding..."
            : success
            ? "Added Successfully!"
            : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "350px",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  heading: { marginBottom: "15px", color: "#333" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontWeight: "bold", textAlign: "left" },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  error: { color: "red", fontSize: "14px" },
};

export default AddEmployee;

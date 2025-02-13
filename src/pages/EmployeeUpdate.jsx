import { useEffect, useState } from "react";

const EmployeeUpdate = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Success/Error messages
  const [formData, setFormData] = useState({
    // Professional Details
    employmentCode: "",
    companyMail: "",
    officePhone: "",
    city: "",
    officeAddressLine1: "",
    officeAddressLine2: "",
    pincode: "",
    reportingManager: "",
    hrName: "",
    dateOfJoining: "",
    department: "",
    jobTitle: "",
    employmentType: "",
    employmentHistory: [],

    // Project Details
    projectName: "",
    projectDescription: "",
    projectStatus: "",

    // Finance Details
    financeType: "",
    financeAmount: "",
    financeCTC: "",
    financeDescription: "",
    financeDate: "",
  });

  const [popup, setPopup] = useState({ show: false, message: "", section: "" });

  useEffect(() => {
    console.log("Fetching details for ID:", id);
    fetchAllDetails();
  }, [id]);

  // Fetch All Details in One Request
  const fetchAllDetails = async () => {
    try {
      const [profResponse, projResponse, finResponse] = await Promise.all([
        fetch(`http://localhost:8080/professional-details/employee/${id}`),
        fetch(`http://localhost:8080/projects/employee/${id}`),
        fetch(`http://localhost:8080/finance/employee/${id}`),
      ]);

      if (!profResponse.ok || !projResponse.ok || !finResponse.ok)
        throw new Error("Failed to fetch details");

      const profData = await profResponse.json();
      const projData = await projResponse.json();
      const finData = await finResponse.json();

      setFormData({
        // Professional Details
        employmentCode: profData.employmentCode || "",
        companyMail: profData.companyMail || "",
        officePhone: profData.officePhone || "",
        city: profData.city || "",
        officeAddressLine1: profData.officeAddressLine1 || "",
        officeAddressLine2: profData.officeAddressLine2 || "",
        pincode: profData.pincode || "",
        reportingManager: profData.reportingManager || "",
        hrName: profData.hrName || "",
        dateOfJoining: profData.dateOfJoining || "",
        department: profData.department || "",
        jobTitle: profData.jobTitle || "",
        employmentType: profData.employmentType || "",
        employmentHistory: profData.employmentHistory || [],

        // Project Details
        projectName: projData.name || "",
        projectDescription: projData.description || "",
        projectStatus: projData.status || "",

        // Finance Details
        financeType: finData.type || "",
        financeAmount: finData.amount || "",
        financeCTC: finData.ctc || "",
        financeDescription: finData.description || "",
        financeDate: finData.date || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show Popup Message
  const showPopup = (message, section) => {
    setPopup({ show: true, message, section });
    setTimeout(() => {
      setPopup({ show: false, message: "", section: "" });
    }, 2000);
  };

  // Update Professional Details
  const updateProfessionalDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/professional-details/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employmentCode: formData.employmentCode,
            companyMail: formData.companyMail,
            officePhone: formData.officePhone,
            city: formData.city,
            officeAddressLine1: formData.officeAddressLine1,
            officeAddressLine2: formData.officeAddressLine2,
            pincode: formData.pincode,
            reportingManager: formData.reportingManager,
            hrName: formData.hrName,
            dateOfJoining: formData.dateOfJoining,
            department: formData.department,
            jobTitle: formData.jobTitle,
            employmentType: formData.employmentType,
            employmentHistory: formData.employmentHistory,
          }),
        }
      );
      if (!response.ok)
        throw new Error("Failed to update professional details");
      showPopup("Professional details updated successfully!", "professional");
    } catch (error) {
      showPopup(error.message, "professional");
    }
  };

  // Update Project Details
  const updateProjectDetails = async () => {
    if (!formData.projectName || !formData.projectDescription) {
      showPopup(
        "Project Name and Project Description cannot be null.",
        "project"
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/projects/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.projectName,
            description: formData.projectDescription,
            status: formData.projectStatus,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update project details");
      showPopup("Project details updated successfully!", "project");
    } catch (error) {
      showPopup(error.message, "project");
    }
  };

  // Update Finance Details
  const updateFinanceDetails = async () => {
    if (!formData.financeType || !formData.financeAmount) {
      showPopup("Finance Type and Finance Amount cannot be null.", "finance");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/finance/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: formData.financeType,
            amount: formData.financeAmount,
            ctc: formData.financeCTC,
            description: formData.financeDescription,
            date: formData.financeDate,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update finance details");
      showPopup("Finance details updated successfully!", "finance");
    } catch (error) {
      showPopup(error.message, "finance");
    }
  };

  const addEmploymentHistory = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      employmentHistory: [
        ...prevFormData.employmentHistory,
        {
          companyName: "",
          designation: "",
          joiningDate: "",
          endDate: "",
        },
      ],
    }));
  };

  const handleEmploymentHistoryChange = (index, field, value) => {
    const updatedHistory = [...formData.employmentHistory];
    updatedHistory[index][field] = value;
    setFormData({ ...formData, employmentHistory: updatedHistory });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Update Employee Details</h2>

      {/* Professional Details */}
      <div style={styles.section}>
        <h3 style={styles.subHeader}>Professional Details</h3>
        <input
          type="text"
          name="employmentCode"
          value={formData.employmentCode}
          onChange={handleChange}
          placeholder="Employment Code"
          style={styles.input}
        />
        <input
          type="email"
          name="companyMail"
          value={formData.companyMail}
          onChange={handleChange}
          placeholder="Company Mail"
          style={styles.input}
        />
        <input
          type="text"
          name="officePhone"
          value={formData.officePhone}
          onChange={handleChange}
          placeholder="Office Phone"
          style={styles.input}
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          style={styles.input}
        />
        <input
          type="text"
          name="officeAddressLine1"
          value={formData.officeAddressLine1}
          onChange={handleChange}
          placeholder="Office Address Line 1"
          style={styles.input}
        />
        <input
          type="text"
          name="officeAddressLine2"
          value={formData.officeAddressLine2}
          onChange={handleChange}
          placeholder="Office Address Line 2"
          style={styles.input}
        />
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          style={styles.input}
        />
        <input
          type="text"
          name="reportingManager"
          value={formData.reportingManager}
          onChange={handleChange}
          placeholder="Reporting Manager"
          style={styles.input}
        />
        <input
          type="text"
          name="hrName"
          value={formData.hrName}
          onChange={handleChange}
          placeholder="HR Name"
          style={styles.input}
        />
        <input
          type="date"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChange}
          placeholder="Date of Joining"
          style={styles.input}
        />

        <h4 style={styles.subHeader}>Employment History</h4>
        {formData.employmentHistory.map((history, index) => (
          <div key={index} style={styles.historyEntry}>
            <input
              type="text"
              name="companyName"
              value={history.companyName}
              onChange={(e) =>
                handleEmploymentHistoryChange(
                  index,
                  "companyName",
                  e.target.value
                )
              }
              placeholder="Company Name"
              style={styles.input}
            />
            <input
              type="date"
              name="startDate"
              value={history.joiningDate}
              onChange={(e) =>
                handleEmploymentHistoryChange(
                  index,
                  "joiningDate",
                  e.target.value
                )
              }
              placeholder="Start Date"
              style={styles.input}
            />
            <input
              type="date"
              name="endDate"
              value={history.endDate || ""}
              onChange={(e) =>
                handleEmploymentHistoryChange(index, "endDate", e.target.value)
              }
              placeholder="End Date (Leave blank if current job)"
              style={styles.input}
            />
            <input
              type="text"
              name="location"
              value={history.location}
              onChange={(e) =>
                handleEmploymentHistoryChange(index, "location", e.target.value)
              }
              placeholder="Location"
              style={styles.input}
            />
          </div>
        ))}
        <button onClick={addEmploymentHistory} style={styles.button}>
          Add Employment History
        </button>
        <button onClick={updateProfessionalDetails} style={styles.button}>
          Save Professional Details
        </button>
        {popup.show && popup.section === "professional" && (
          <div style={styles.popup}>{popup.message}</div>
        )}
      </div>

      {/* Projects */}
      <div style={styles.section}>
        <h3 style={styles.subHeader}>Project Details</h3>
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="Project Name"
          style={styles.input}
        />
        <textarea
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleChange}
          placeholder="Project Description"
          style={{ ...styles.input, height: "100px" }}
        ></textarea>
        <select
          name="projectStatus"
          value={formData.projectStatus}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Project Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
        <button onClick={updateProjectDetails} style={styles.button}>
          Save Project Details
        </button>
        {popup.show && popup.section === "project" && (
          <div style={styles.popup}>{popup.message}</div>
        )}
      </div>

      {/* Finance */}
      <div style={styles.section}>
        <h3 style={styles.subHeader}>Finance Details</h3>
        <select
          name="financeType"
          value={formData.financeType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Finance Type</option>
          <option value="Investment">Salary</option>
          <option value="Loan">Loan</option>
          <option value="Grant">Bonus</option>
        </select>
        <input
          type="number"
          name="financeAmount"
          value={formData.financeAmount}
          onChange={handleChange}
          placeholder="Finance Amount"
          style={styles.input}
        />
        <input
          type="number"
          name="financeCTC"
          value={formData.financeCTC}
          onChange={handleChange}
          placeholder="Finance CTC"
          style={styles.input}
        />
        <input
          type="date"
          name="financeDate"
          value={formData.financeDate}
          onChange={handleChange}
          placeholder="Date"
          style={styles.input}
        />
        <textarea
          name="financeDescription"
          value={formData.financeDescription}
          onChange={handleChange}
          placeholder="Finance Description"
          style={{ ...styles.input, height: "100px" }}
        ></textarea>
        <button onClick={updateFinanceDetails} style={styles.button}>
          Save Finance Details
        </button>
        {popup.show && popup.section === "finance" && (
          <div style={styles.popup}>{popup.message}</div>
        )}
      </div>

      <button
        className="close-btn"
        onClick={onClose}
        style={styles.closeButton}
      >
        Close
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  section: {
    marginBottom: "20px",
    position: "relative",
  },
  subHeader: {
    marginBottom: "10px",
    color: "#555",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    marginTop: "10px",
    marginRight: "10px",
    backgroundColor: "#5cb85c",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  historyEntry: {
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  popup: {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
};

export default EmployeeUpdate;

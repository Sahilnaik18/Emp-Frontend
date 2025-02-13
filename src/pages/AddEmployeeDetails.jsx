import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployeeDetails = ({ adminId, employeeId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    employmentHistory: [],
    projects: [],
    financeDetails: [],
  });

  const [history, setHistory] = useState([]);
  const [newHistory, setNewHistory] = useState({
    companyName: "",
    designation: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "",
  });

  const [newFinance, setNewFinance] = useState({
    type: "",
    amount: "",
    ctc: "",
    description: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHistoryChange = (e) => {
    setNewHistory({ ...newHistory, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleFinanceChange = (e) => {
    setNewFinance({ ...newFinance, [e.target.name]: e.target.value });
  };

  const addEmploymentHistory = () => {
    setHistory([...history, newHistory]);
    setNewHistory({
      companyName: "",
      designation: "",
      startDate: "",
      endDate: "",
      location: "",
    });
  };

  const addProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/add?adminId=${adminId}&employeeId=${employeeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        }
      );
      if (response.ok) {
        setFormData({
          ...formData,
          projects: [...formData.projects, newProject],
        });
        setNewProject({
          name: "",
          description: "",
          status: "",
        });
        alert("Project added successfully!");
      } else {
        alert("Failed to add project.");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Error occurred while adding project.");
    }
  };

  const addFinance = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/finance/add?adminId=1&employeeId=1`, // Using fixed adminId and employeeId as per your request
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFinance),
        }
      );
      if (response.ok) {
        setFormData({
          ...formData,
          financeDetails: [...formData.financeDetails, newFinance],
        });
        setNewFinance({
          type: "",
          amount: "",
          ctc: "",
          description: "",
          date: "",
        });
        alert("Finance details added successfully!");
      } else {
        alert("Failed to add finance details.");
      }
    } catch (error) {
      console.error("Error adding finance details:", error);
      alert("Error occurred while adding finance details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...formData, employmentHistory: history };

    try {
      const response = await fetch(
        `http://localhost:8080/professional-details/add?adminId=${adminId}&employeeId=${employeeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );
      if (response.ok) {
        alert("Employee details added successfully!");
        navigate("/admin/dashboard");
      } else {
        alert("Failed to add employee details.");
      }
    } catch (error) {
      console.error("Error adding details:", error);
      alert("Error occurred while adding details.");
    }
  };

  return (
    <div>
      <h2>Add Employee Details</h2>
      <form onSubmit={handleSubmit}>
        {/* <input
          type="text"
          name="employmentCode"
          placeholder="Employment Code"
          onChange={handleChange}
          required
        /> */}
        <input
          type="email"
          name="companyMail"
          placeholder="Company Mail"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="officePhone"
          placeholder="Office Phone"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="officeAddressLine1"
          placeholder="Office Address Line 1"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="officeAddressLine2"
          placeholder="Office Address Line 2"
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reportingManager"
          placeholder="Reporting Manager"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="hrName"
          placeholder="HR Name"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dateOfJoining"
          onChange={handleChange}
          required
        />

        <h3>Employment History</h3>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          onChange={handleHistoryChange}
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          onChange={handleHistoryChange}
          required
        />
        <input
          type="date"
          name="startDate"
          onChange={handleHistoryChange}
          required
        />
        <input type="date" name="endDate" onChange={handleHistoryChange} />
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleHistoryChange}
          required
        />
        <button type="button" onClick={addEmploymentHistory}>
          Add History
        </button>

        <h3>Projects</h3>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          onChange={handleProjectChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Project Description"
          onChange={handleProjectChange}
          required
        />
        <input
          type="text"
          name="status"
          placeholder="Project Status"
          onChange={handleProjectChange}
          required
        />
        <button type="button" onClick={addProject}>
          Add Project
        </button>

        <h3>Finance Details</h3>
        <input
          type="text"
          name="type"
          placeholder="Type"
          onChange={handleFinanceChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          onChange={handleFinanceChange}
          required
        />
        <input
          type="number"
          name="ctc"
          placeholder="CTC"
          onChange={handleFinanceChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleFinanceChange}
          required
        />
        <input
          type="date"
          name="date"
          onChange={handleFinanceChange}
          required
        />
        <button type="button" onClick={addFinance}>
          Add Finance
        </button>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddEmployeeDetails;

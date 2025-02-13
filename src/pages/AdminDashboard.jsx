import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeUpdate from "./EmployeeUpdate";
import AddEmployeeDetails from "./AddEmployeeDetails";
import AddEmployee from "./AddEmployee";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [updatingEmployeeId, setUpdatingEmployeeId] = useState(null);
  const [addingDetailsEmployeeId, setAddingDetailsEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [selectedSection, setSelectedSection] = useState("employees");

  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
    fetchEmployees();
  }, [admin]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/employees/${admin.adminId}`
      );
      if (!response.ok) throw new Error("Failed to fetch employees");
      const result = await response.json();
      setEmployees(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchQuery) ||
      emp.email.toLowerCase().includes(searchQuery) ||
      emp.empCode.toLowerCase().includes(searchQuery)
  );

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/admin/employee/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      // Filter out the deleted employee from the state
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== employeeId)
      );

      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Welcome, {admin.fullName} 👋</h2>
        <ul>
          <li>
            <button
              onClick={() => {
                setSelectedSection("employees");
                setShowAddEmployee(false);
                setSelectedEmployeeId(null);
                setUpdatingEmployeeId(null);
                setAddingDetailsEmployeeId(null);
              }}
            >
              All Employees
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSelectedSection("addEmployee");
                setShowAddEmployee(true);
                setAddingDetailsEmployeeId(null);
              }}
            >
              Add Employee
            </button>
          </li>
          <li>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("admin");
                navigate("/admin/login");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="content">
        {selectedSection === "addEmployee" ? (
          <AddEmployee
            onEmployeeAdded={fetchEmployees}
            onClose={() => setSelectedSection("employees")}
          />
        ) : selectedEmployeeId ? (
          <EmployeeDetails
            id={selectedEmployeeId}
            onClose={() => setSelectedEmployeeId(null)}
          />
        ) : updatingEmployeeId ? (
          <EmployeeUpdate
            key={updatingEmployeeId}
            id={updatingEmployeeId}
            onClose={() => setUpdatingEmployeeId(null)}
          />
        ) : addingDetailsEmployeeId ? (
          <AddEmployeeDetails
            id={addingDetailsEmployeeId}
            adminId={admin.adminId}
            employeeId={addingDetailsEmployeeId}
            onClose={() => setAddingDetailsEmployeeId(null)}
          />
        ) : loading ? (
          <h2>Loading...</h2>
        ) : (
          <div className="employee-list">
            <h2>All Employees</h2>
            {/* <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-bar"
            /> */}
            <table>
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  {/* <th>Emp Code</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1}</td>
                    <td>{emp.fullName || "N/A"}</td>
                    <td>{emp.email}</td>
                    {/* <td>{emp.empCode || "N/A"}</td> */}
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedEmployeeId(emp.id)}
                      >
                        View
                      </button>
                      <button
                        className="update-btn"
                        onClick={() => setUpdatingEmployeeId(emp.id)}
                      >
                        Update
                      </button>
                      <button
                        className="add-details-btn"
                        onClick={() => setAddingDetailsEmployeeId(emp.id)}
                      >
                        Add Details
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("personal");
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
      fetchEmployeeData(loggedInUser.id);
    }
  }, [navigate]);

  const fetchEmployeeData = async (id) => {
    try {
      const details = await (
        await fetch(`http://localhost:8080/employee/${id}`)
      ).json();
      const professional = await (
        await fetch(`http://localhost:8080/professional-details/employee/${id}`)
      ).json();
      const projects = await (
        await fetch(`http://localhost:8080/projects/employee/${id}`)
      ).json();
      const finance = await (
        await fetch(`http://localhost:8080/finance/employee/${id}`)
      ).json();

      setEmployeeData({
        details,
        professional: professional[0],
        projects,
        finance,
      });
    } catch (error) {
      console.error("Error fetching employee details.");
    }
    setLoading(false);
  };

  if (!user) return <p>Loading user data...</p>;
  if (loading) return <p>Loading employee details...</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <h2>Employee Dashboard</h2>
          {/* <SidebarButton
            label="Personal Details"
            isActive={selectedSection === "personal"}
            onClick={() => setSelectedSection("personal")}
          /> */}
          <SidebarButton
            label="Professional Details"
            isActive={selectedSection === "professional"}
            onClick={() => setSelectedSection("professional")}
          />
          <SidebarButton
            label="Projects"
            isActive={selectedSection === "projects"}
            onClick={() => setSelectedSection("projects")}
          />
          <SidebarButton
            label="Finance"
            isActive={selectedSection === "finance"}
            onClick={() => setSelectedSection("finance")}
          />
          <SidebarButton
            label="Logout"
            isActive={selectedSection === "logout"}
            onClick={() => {
              localStorage.removeItem("admin");
              navigate("/admin/login");
            }}
          />
        </div>

        <div style={styles.content}>
          <h2>Welcome, {employeeData.details.fullName}</h2>
          {/* {selectedSection === "personal" && (
            <PersonalDetails data={employeeData.details} />
          )} */}
          {selectedSection === "professional" && (
            <ProfessionalDetails data={employeeData.professional} />
          )}
          {selectedSection === "projects" && (
            <Projects data={employeeData.projects} />
          )}
          {selectedSection === "finance" && (
            <Finance data={employeeData.finance} userId={user.id} />
          )}
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} EMP2. All rights reserved.</p>
      </footer>
    </div>
  );
};

const SidebarButton = ({ label, isActive, onClick }) => (
  <button
    style={{
      ...styles.button,
      ...(isActive ? styles.activeButton : {}),
    }}
    onMouseEnter={(e) =>
      (e.target.style.background = styles.buttonHover.background)
    }
    onMouseLeave={(e) => (e.target.style.background = "#34495E")}
    onClick={onClick}
  >
    {label}
  </button>
);

const PersonalDetails = ({ data }) => (
  <div>
    <h3>Personal Details</h3>
    <p>
      <strong>Email:</strong> {data.email}
    </p>
    <p>
      <strong>Mobile:</strong> {data.mobile}
    </p>
    <p>
      <strong>Address:</strong> {data.address}
    </p>
  </div>
);

const ProfessionalDetails = ({ data }) => (
  <div>
    <h3>Professional Details</h3>
    <p>
      <strong>Employment Code:</strong> {data.employmentCode || "N/A"}
    </p>
    <p>
      <strong>Company Email:</strong> {data.companyMail || "N/A"}
    </p>
    <p>
      <strong>Date of Joining:</strong> {data.dateOfJoining}
    </p>
    <p>
      <strong>Office Phone:</strong> {data.officePhone || "N/A"}
    </p>
    <p>
      <strong>City:</strong> {data.city || "N/A"}
    </p>
    <p>
      <strong>Office Address:</strong> {data.officeAddressLine1},{" "}
      {data.officeAddressLine2}
    </p>
    <p>
      <strong>Pincode:</strong> {data.pincode}
    </p>
    <p>
      <strong>Reporting Manager:</strong> {data.reportingManager}
    </p>
    <p>
      <strong>HR Name:</strong> {data.hrName}
    </p>
  </div>
);

const Projects = ({ data }) => (
  <div>
    <h3>Projects</h3>
    <ul>
      {data.length > 0 ? (
        data.map((proj) => (
          <li key={proj.id}>
            <strong>{proj.name}</strong> - {proj.status}
          </li>
        ))
      ) : (
        <p>No projects assigned.</p>
      )}
    </ul>
  </div>
);

const Finance = ({ data, userId }) => (
  <div>
    <h3>Finance</h3>
    <table style={styles.table}>
      <thead>
        <tr style={styles.tableHeader}>
          <th style={styles.tableCell}>Type</th>
          <th style={styles.tableCell}>Amount</th>
          <th style={styles.tableCell}>CTC</th>
          <th style={styles.tableCell}>Date</th>
          <th style={styles.tableCell}>
            <a
              href={`http://localhost:8080/payslip/download/${userId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button style={styles.downloadButton}>Download Payslip</button>
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((fin) => (
            <tr key={fin.id}>
              <td style={styles.tableCell}>{fin.type}</td>
              <td style={styles.tableCell}>₹{fin.amount}</td>
              <td style={styles.tableCell}>₹{fin.ctc}</td>
              <td style={styles.tableCell}>{fin.date}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td style={styles.tableCell} colSpan="5">
              No financial records available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    fontFamily: "'Poppins', sans-serif",
    background: "#ECF0F1",
    margin: "-70px",
  },
  container: {
    display: "flex",
    flex: 1,
  },
  sidebar: {
    background: "linear-gradient(135deg, #2C3E50, #34495E)",
    color: "#fff",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "250px",
    boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
  },
  button: {
    background: "#34495E",
    color: "#fff",
    border: "none",
    padding: "12px",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "16px",
    transition: "background 0.3s ease, transform 0.2s",
  },
  activeButton: {
    background: "#1ABC9C",
    fontWeight: "bold",
  },
  buttonHover: {
    background: "#1ABC9C",
    transform: "scale(1.05)",
  },
  content: {
    flex: 1,
    padding: "30px",
    background: "#FFFFFF",
    borderRadius: "8px",
    margin: "0",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    background: "#1ABC9C",
    color: "#fff",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  downloadButton: {
    background: "#2ECC71",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background 0.3s",
  },
  footer: {
    background: "white",
    color: "black",
    textAlign: "center",
    padding: "10px",
  },
};

export default EmployeeDashboard;

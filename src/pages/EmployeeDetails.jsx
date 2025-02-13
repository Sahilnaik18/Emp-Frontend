import { useEffect, useState } from "react";

const EmployeeDetails = ({ id, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching details for ID:", id);
    const fetchEmployeeDetails = async () => {
      try {
        const details = await (
          await fetch(`http://localhost:8080/employee/${id}`)
        ).json();
        const professional = await (
          await fetch(
            `http://localhost:8080/professional-details/employee/${id}`
          )
        ).json();
        const projects = await (
          await fetch(`http://localhost:8080/projects/employee/${id}`)
        ).json();
        const finance = await (
          await fetch(`http://localhost:8080/finance/employee/${id}`)
        ).json();

        setEmployee({
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

    fetchEmployeeDetails();
  }, [id]);

  if (loading)
    return <h2 style={{ textAlign: "center", color: "#555" }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onClose}>
        🔙 Back
      </button>

      {/* Employee General Info */}
      <div style={styles.card}>
        {/* Profile Icon */}
        <div style={styles.profilePic}>
          <i className="fas fa-user-circle" style={styles.profileIcon}></i>
        </div>
        <div>
          <h2 style={styles.header}>{employee.details.fullName}</h2>
          <p>
            <strong>ID:</strong> {employee.details.id}
          </p>
          <p>
            <strong>Email:</strong> {employee.details.email}
          </p>
          <p>
            <strong>Mobile:</strong> {employee.details.mobile}
          </p>
          <p>
            <strong>Address:</strong> {employee.details.address}
          </p>
        </div>
      </div>

      {/* Professional Details */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Professional Details</h3>
        <p>
          <strong>Employment Code:</strong>{" "}
          {employee.professional?.employmentCode || "N/A"}
        </p>
        <p>
          <strong>Company Email:</strong>{" "}
          {employee.professional?.companyMail || "N/A"}
        </p>
        <p>
          <strong>Office Phone:</strong>{" "}
          {employee.professional?.officePhone || "N/A"}
        </p>
        <p>
          <strong>City:</strong> {employee.professional?.city || "N/A"}
        </p>
        <p>
          <strong>Office Address:</strong>{" "}
          {employee.professional?.officeAddressLine1},{" "}
          {employee.professional?.officeAddressLine2}
        </p>
        <p>
          <strong>Pincode:</strong> {employee.professional?.pincode}
        </p>
        <p>
          <strong>Reporting Manager:</strong>{" "}
          {employee.professional?.reportingManager}
        </p>
        <p>
          <strong>HR Name:</strong> {employee.professional?.hrName}
        </p>
        <p>
          <strong>Date of Joining:</strong>{" "}
          {employee.professional?.dateOfJoining}
        </p>

        {/* Employment History */}
        <h4 style={{ marginTop: "15px", color: "#007BFF" }}>
          Employment History
        </h4>
        <ul>
          {employee.professional?.employmentHistory?.length > 0 ? (
            employee.professional.employmentHistory.map((job, index) => (
              <li key={index}>
                <strong>{job.companyName}</strong> - {job.joiningDate || "N/A"}{" "}
                to {job.endDate || "Present"}
              </li>
            ))
          ) : (
            <li>No previous employment records.</li>
          )}
        </ul>
      </div>

      {/* Projects Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Projects</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employee.projects.length > 0 ? (
              employee.projects.map((proj) => (
                <tr key={proj.id}>
                  <td>{proj.name}</td>
                  <td>{proj.description}</td>
                  <td
                    style={{
                      color: proj.status === "Completed" ? "green" : "orange",
                    }}
                  >
                    {proj.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No projects assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Finance Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Finance</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>CTC</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {employee.finance.length > 0 ? (
              employee.finance.map((fin) => (
                <tr key={fin.id}>
                  <td>{fin.type}</td>
                  <td>₹{fin.amount.toLocaleString()}</td>
                  <td>₹{fin.ctc.toLocaleString()}</td>
                  <td>{fin.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No financial records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDetails;

// Inline Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  backButton: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
    marginBottom: "20px",
  },
  profilePic: {
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    marginRight: "15px",
  },
  profileIcon: {
    fontSize: "50px",
    color: "#555",
  },
  header: {
    margin: "0",
    color: "#333",
  },
  section: {
    marginBottom: "20px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
  },
  sectionHeader: {
    color: "#007BFF",
    borderBottom: "2px solid #007BFF",
    paddingBottom: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    borderRadius: "5px",
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#007BFF",
    color: "#fff",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
  },
};

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EmployeeView = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    details: null,
    professional: null,
    projects: null,
    finance: null,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const [detailsRes, profRes, projRes, financeRes] = await Promise.all([
          fetch(`http://localhost:8080/employee/${employeeId}`).then((res) =>
            res.json()
          ),
          fetch(
            `http://localhost:8080/professional-details/employee/${employeeId}`
          ).then((res) => res.json()),
          fetch(`http://localhost:8080/projects/employee/${employeeId}`).then(
            (res) => res.json()
          ),
          fetch(`http://localhost:8080/finance/employee/${employeeId}`).then(
            (res) => res.json()
          ),
        ]);

        setEmployeeData({
          details: detailsRes,
          professional: profRes,
          projects: projRes,
          finance: financeRes,
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="employee-view-container">
      <button onClick={() => navigate("/admin")}>⬅ Back</button>
      <h2>Employee View</h2>

      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("details")}>Details</button>
        <button onClick={() => setActiveTab("professional")}>
          Professional Details
        </button>
        <button onClick={() => setActiveTab("projects")}>Projects</button>
        <button onClick={() => setActiveTab("finance")}>Finance</button>
      </div>

      {/* Content Based on Active Tab */}
      <div className="tab-content">
        {activeTab === "details" && (
          <div>
            <h3>Personal Details</h3>
            <p>
              <strong>Name:</strong> {employeeData.details.fullName}
            </p>
            <p>
              <strong>Email:</strong> {employeeData.details.email}
            </p>
            <p>
              <strong>Phone:</strong> {employeeData.details.mobile}
            </p>
          </div>
        )}

        {activeTab === "professional" && (
          <div>
            <h3>Professional Details</h3>
            <p>
              <strong>Position:</strong> {employeeData.professional.position}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {employeeData.professional.department}
            </p>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            <h3>Projects</h3>
            {employeeData.projects.map((proj) => (
              <p key={proj.id}>
                <strong>{proj.name}:</strong> {proj.description}
              </p>
            ))}
          </div>
        )}

        {activeTab === "finance" && (
          <div>
            <h3>Finance Details</h3>
            <p>
              <strong>Salary:</strong> ${employeeData.finance.salary}
            </p>
            <p>
              <strong>Bank:</strong> {employeeData.finance.bankName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeView;

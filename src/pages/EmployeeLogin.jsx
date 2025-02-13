import AuthForm from "../components/AuthForm";

const EmployeeLogin = () => (
  <AuthForm
    title="Employee Login"
    fields={[
      { label: "Email", name: "email", type: "email" },
      { label: "Password", name: "password", type: "password" },
    ]}
    endpoint="http://localhost:8080/employee/login"
    method="POST"
    redirectText="Back to Admin Login?"
    redirectPath="/admin/login"
  />
);

export default EmployeeLogin;

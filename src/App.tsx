import "./Style/common.scss";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../Pages/AuthPages/LoginPage";
import SignupPage from "../Pages/AuthPages/SignupPage";
import RequireAuth from "../RoutesProtection/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={""} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

  export default App;

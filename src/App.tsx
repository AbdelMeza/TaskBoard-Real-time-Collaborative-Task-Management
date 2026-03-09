import LoginPage from "../Pages/AuthPages/LoginPage";
import "./Style/common.scss";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={""} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;

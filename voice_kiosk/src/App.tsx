import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import AuthSuccess from "@/pages/AuthSuccess";
import KioskApp from "@/pages/KioskApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route path="/" element={<KioskApp />} />
      </Routes>
    </BrowserRouter>
  );
}

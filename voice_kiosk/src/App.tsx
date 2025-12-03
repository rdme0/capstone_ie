import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import AuthSuccess from "@/pages/AuthSuccess";
import KioskApp from "@/pages/KioskApp"; // default import로 변경
import ProtectedRoute from "@/components/ProtectedRoute";
// import useAuthCheck from "@/hooks/useAuth";

export default function App() {
  // useAuthCheck();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <KioskApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

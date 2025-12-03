import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore"; // Zustand 등 사용 시

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuthStore(); // 상태 저장용

  useEffect(() => {
    const token = searchParams.get("accessToken");

    if (token) {
      localStorage.setItem("accessToken", token);
      setToken(token);
      navigate("/"); // 로그인 성공 → 메인 이동
    } else {
      alert("로그인 실패: 토큰이 없습니다.");
      navigate("/login");
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}

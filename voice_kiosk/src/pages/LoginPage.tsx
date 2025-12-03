import kakaoLoginBtn from "@/assets/kakao_login_large_narrow.png";

export default function LoginPage() {
  const handleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL; // 백엔드 주소
    const redirectUrl = window.location.origin; // 프론트 주소 (자동 감지)

    if (!baseUrl) {
      alert("⚠️ VITE_API_BASE_URL 환경변수가 설정되지 않았습니다!");
      return;
    }

    // 백엔드 로그인 엔드포인트로 이동 (동적 redirect 포함)
    window.location.href = `${baseUrl}/oauth2/authorization/kakao?redirect=${redirectUrl}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src={kakaoLoginBtn}
        alt="카카오 로그인"
        onClick={handleLogin}
        className="cursor-pointer w-60"
      />
    </div>
  );
}

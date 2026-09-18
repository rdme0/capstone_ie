import clickImg from "../assets/Click.png";

interface IdleProps {
  isStarted: boolean;
  serverReady: boolean;
  handleTouch: () => void;
}

export default function Idle({ isStarted, serverReady, handleTouch }: IdleProps) {
  if (isStarted && !serverReady) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-black/65 relative">
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "25%" }}>
          <span className="text-white text-7xl font-bold text-center">⏳ 서버 연결 중...</span>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div
        onClick={handleTouch}
        className="w-full h-full flex flex-col justify-center items-center bg-black/65 cursor-pointer relative"
      >
        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ top: "25%" }}>
          <span className="text-white text-7xl font-bold text-center">화면을 터치해 시작하세요</span>
        </div>
        <img className="w-96 h-96 animate-bounce" src={clickImg} alt="터치 아이콘" />
      </div>
    );
  }

  return null;
}

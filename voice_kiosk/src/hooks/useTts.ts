// src/hooks/useTts.ts (수정된 speak 함수)

export default function useTts() {
  /**
   * 텍스트를 음성으로 읽어주는 함수
   */
  const speak = (text: string) => {
    if (!text) return;

    // 이미 말하고 있으면 멈춤
    window.speechSynthesis.cancel();

    // 💡 SpeechSynthesisUtterance 객체 생성
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 💡 [해결] utterance 객체가 실제로 생성되었는지 확인
    if (!utterance) {
        console.error("❌ SpeechSynthesisUtterance 객체 생성 실패.");
        return; // 객체 생성 실패 시 조기 종료
    }
    
    utterance.lang = "ko-KR"; // 한국어 설정
    utterance.rate = 1;// 말하기 속도
    utterance.pitch = 1;// 음 높이

    // 💡 [해결] speak 함수 호출 시 undefined가 아님을 확인했으므로 오류 사라짐
    window.speechSynthesis.speak(utterance); 
    console.log("🗣️ 읽는 중:", text);
  };
  
  // ... (stop 함수 및 return 유지)
  
  const stop = () => {
    window.speechSynthesis.cancel();
  };
  const activateTts = () => {
        // ... activateTts 로직 ...
        if (window.speechSynthesis.getVoices().length === 0) {
             window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
             window.speechSynthesis.cancel();
        }
    };

  return { speak, stop, activateTts };
}
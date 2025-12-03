// src/components/Captions.tsx
import { useKioskStore } from "@/store/kioskStore";

export default function Captions() {
  const text = useKioskStore((state) => state.text);

  return (
    <div
      key={text} 
      className="
        w-[913px] 
        h-56 
        text-center 
        justify-start 
        text-neutral-800 
        text-6xl 
        font-semibold 
        font-['Pretendard']
        fade-text  /* ← 애니메이션 class 추가 */
      "
    >
      {text}
    </div>
  );
}

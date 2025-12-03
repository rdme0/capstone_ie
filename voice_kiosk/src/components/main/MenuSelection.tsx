// src/components/main/MenuSelection.tsx
import Header from "@/components/Header";
import Character from "@/components/Character";
import Captions from "@/components/Captions";

export default function MenuSelection() {
  return (
    <div className="relative w-[1080px] h-[1920px] overflow-hidden">
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-[1080px] h-36 overflow-hidden">
        <Header />
      </div>

      {/* CHARACTER */}
      <div className="absolute top-[149px] left-0 w-[1080px] h-[674px] flex justify-center">
        <Character />
      </div>

      {/* CAPTION */}
      <div className="absolute w-[1080px] h-[895px] left-0 top-[823px]">
        <div className="absolute left-[84px] top-[70px] w-[913px] h-56 text-center text-neutral-800 text-6xl font-semibold font-['Pretendard']">
          <Captions />
        </div>
      </div>
    </div>
  );
}

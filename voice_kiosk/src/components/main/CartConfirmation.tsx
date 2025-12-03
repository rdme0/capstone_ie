import Header from "@/components/Header";
import Character from "@/components/Character";
import Captions from "@/components/Captions";
import CartTable from "@/components/CartTable"; // ✅ 장바구니 테이블 추가

export default function CartConfirmation() {
  return (
    <div className="relative w-[1080px] h-[1920px] overflow-hidden bg-gray-100">
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-[1080px] h-36 overflow-hidden">
        <Header />
      </div>

      {/* CHARACTER */}
      <div className="absolute top-[149px] left-0 w-[1080px] h-[674px] flex justify-center">
        <Character />
      </div>

      {/* CART TABLE (중간 하단 영역) */}
      <div className="absolute left-[93px] top-[850px] w-[894px] h-[548px] flex justify-center items-center">
        <CartTable />
      </div>

      {/* CAPTION (맨 아래 영역) */}
      <div className="absolute left-0 top-[1500px] w-[1080px] h-[300px] text-center">
        <div className="w-full text-neutral-800 text-6xl font-semibold font-pretendard">
          <Captions />
        </div>
      </div>
    </div>
  );
}

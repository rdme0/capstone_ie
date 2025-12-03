// /src/components/CartTable.tsx

import { useKioskStore } from "@/store/kioskStore";

export default function CartTable() {
  const cart = useKioskStore((state) => state.cart);

  return (
    <div className="w-[894px] h-[548px] bg-[#ECEEF5] rounded-2xl p-6 shadow-sm flex flex-col">
      {/* 테이블 헤더 */}
      <div className="grid grid-cols-4 text-center text-black text-3xl font-semibold font-pretendard border-b border-gray-400 pb-3">
        <div>메뉴</div>
        <div>수량</div>
        <div>옵션</div>
        <div>금액</div>
      </div>

      {/* 테이블 본문 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent mt-2">
        {cart.menus.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-2xl font-pretendard">
            장바구니가 비어 있습니다 ☕️
          </div>
        ) : (
          cart.menus.map((menu) => (
            <div
              key={menu.id}
              className="grid grid-cols-4 text-center text-black text-3xl font-semibold font-pretendard py-3 border-b border-gray-300"
            >
              {/* 메뉴 이름 */}
              <div>{menu.name}</div>

              {/* 수량 (임시로 1, 나중에 백엔드에서 제공 시 수정 가능) */}
              <div>1</div>

              {/* 옵션 */}
              <div>
                {menu.options.length > 0
                  ? menu.options.map((opt) => opt.name).join(", ")
                  : "-"}
              </div>

              {/* 금액 (옵션 합산 포함 가능) */}
              <div>
                {menu.price.toLocaleString()} 원
              </div>
            </div>
          ))
        )}
      </div>

      {/*총합계 */}
      <div className="grid grid-cols-4 text-center text-black text-3xl font-semibold font-pretendard mt-3">
        <div>총 합계</div>
        <div>{cart.menuCount}</div>
        <div>-</div>
        <div>{cart.totalPrice.toLocaleString()} 원</div>
      </div>
    </div>
  );
}

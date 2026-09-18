import { memo } from "react";

export interface CartMenu {
  id: number;
  name: string;
  price: number;
  options: { name: string }[];
}

interface Props {
  menu: CartMenu;
}

function CartRow({ menu }: Props) {
  return (
    <div className="grid grid-cols-4 text-center text-black text-3xl font-semibold font-pretendard py-3 border-b border-gray-300">
      <div>{menu.name}</div>
      <div>1</div>
      <div>{menu.options.length > 0 ? menu.options.map((opt) => opt.name).join(", ") : "-"}</div>
      <div>{menu.price.toLocaleString()} 원</div>
    </div>
  );
}

export default memo(CartRow);

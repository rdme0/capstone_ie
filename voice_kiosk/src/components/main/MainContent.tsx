// 키오스크 상태(step)에 따라 UI를 바꾸는 컴포넌트

import { useKioskStore } from "@/store/kioskStore";
import MenuSelection from "./MenuSelection";
import PaymentConfirmation from "./PaymentConfirmation";
import Completed from "./Completed"; 
import CartConfirmation from "./CartConfirmation";

export default function MainContent() {
  const step = useKioskStore((state) => state.step);

  switch (step) {
    case "MENU_SELECTION":
      return <MenuSelection />;

    case "CART_CONFIRMATION":
      return <CartConfirmation />;

    case "PAYMENT_CONFIRMATION":
      return <PaymentConfirmation />;

    case "COMPLETED": //
      return <Completed />;

    default:
      return null;
  }
}

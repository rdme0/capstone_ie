import characterImg from "../assets/Character.png";

export default function Character() {
  return (
    <img
      src={characterImg}
      alt="직원 캐릭터"
      className="w-[625.5px] h-[674px] object-contain"
    />
  );
}

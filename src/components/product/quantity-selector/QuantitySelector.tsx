"use client";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChanged: (value: number) => void;
  // Máximo permitido (p. ej. el stock de la talla). Por defecto 5.
  max?: number;
}
export const QuantitySelector = ({ quantity, onQuantityChanged, max = 5 }: Props) => {
  // const [count, setCount] = useState(quantity);
  const onValueChanged = (value: number) => {
    if (quantity + value < 1 || quantity + value > max) {
      return null;
    }
    onQuantityChanged(quantity + value);

  };
  return (
    <div className="flex ">
      <button onClick={() => onValueChanged(-1)}>
        <IoRemoveCircleOutline />
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-300 text-center rounded">
        {quantity}
      </span>
      <button onClick={() => onValueChanged(1)}>
        <IoAddCircleOutline />
      </button>
    </div>
  );
};

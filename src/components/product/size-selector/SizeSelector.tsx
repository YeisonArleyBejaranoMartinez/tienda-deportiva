import type { ProductVariant, Size } from "@/src/interfaces";
import clsx from "clsx";

interface Props {
  selectedSize?: Size;
  variants: ProductVariant[];
  onSizeChanged: (size: Size) => void;
}
export const SizeSelector = ({ selectedSize, variants, onSizeChanged }: Props) => {
  return (
    <div className="my-5 ">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map(({ size, stock }) => (
          <button
            type="button"
            onClick={() => onSizeChanged(size)}
            key={size}
            disabled={stock <= 0}
            title={stock <= 0 ? "Agotado" : `${stock} disponibles`}
            className={clsx("px-2 hover:underline text-lg", {
              "bg-blue-500 text-white": size === selectedSize,
              "line-through text-gray-400 cursor-not-allowed hover:no-underline":
                stock <= 0,
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

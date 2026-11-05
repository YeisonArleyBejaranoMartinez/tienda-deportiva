import Image from "next/image";
interface Props{
    src?: string;
    alt?: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
    width: number;
    height: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
// Acepta URLs completas (Cloudinary), rutas absolutas ("/imgs/...") o
// nombres de archivo en /public/products. Sin imagen muestra el placeholder.
export const ProductImage = ({src, alt, className, width, height, onMouseEnter, onMouseLeave }: Props) => {
  const localSrc = (src)?
  src.startsWith("http") || src.startsWith("/")
  ? src : `/products/${src}`
  : `/imgs/placeholder.jpg`;
    return (
      <Image
        alt={alt ? alt : "Imagen del producto"}
        src={localSrc}
        width={width}
        height={height}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
};

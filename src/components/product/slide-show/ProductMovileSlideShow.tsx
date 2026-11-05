"use client";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./slideShow.css";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import { ProductImage } from "../product-image/product-image";
interface Props {
  images: string[];
  title: string;
  className?: string;
}
export const ProductMovileSlideShow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{
          width: "100vw",
          height: "100vh",
        }}
        navigation={true}
        autoplay={{
          delay: 2500,
        }}
        pagination
        modules={[FreeMode, Navigation, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {(images.length > 0 ? images : ["/imgs/placeholder.jpg"]).map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              alt={title}
              width={600}
              height={500}
              src={image}
              className=" object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

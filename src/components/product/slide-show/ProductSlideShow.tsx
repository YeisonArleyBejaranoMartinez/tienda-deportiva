"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperObject } from "swiper";
// Import Swiper styles
// import "swiper/css";
// import "swiper/css/free-mode";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";
import "./slideShow.css";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";
// import Image from "next/image";
import { ProductImage } from "../product-image/product-image";
interface Props {
  images: string[];
  title: string;
  className?: string;
}
export const ProductSlideShow = ({ images, title, className }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
  const slideImages = images.length > 0 ? images : ["/imgs/placeholder.jpg"];
  return (
    <div className={className}>
      <Swiper
        // style={
        //   {
        //     "--swiper-navigation-color": "#fff",
        //     "--swiper-pagination-color": "#fff",
        //   } as React.CSSProperties
        // }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2500,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {slideImages.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              alt={title}
              width={300}
              height={300}
              src={images[0]}
              className="rounded-lg object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {slideImages.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              alt={title}
              width={300}
              height={300}
              src={images[0]}
              className="rounded-lg object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

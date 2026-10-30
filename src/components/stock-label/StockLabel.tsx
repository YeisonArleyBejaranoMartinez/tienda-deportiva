"use client";

import { useEffect, useState } from "react";
import { titleFont } from "@/src/confic/fonts";
import type { Metadata } from "next";

type Props = {
  slug: string;
};


export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/stock/${slug}`)
      .then((res) => res.json())
      .then((data) => setStock(data.stock))
      .catch(() => setStock(0));
  }, [slug]);

  if (stock === null) {
    return (
      <h1
        className={`${titleFont.className} antialiased text-px font-bold animate-pulse bg-gray-200`}
      >
        &nbsp;
      </h1>
    );
  }

  return (
    <h1 className={`${titleFont.className} antialiased text-px font-bold`}>
      Stock: {stock} disponibles
    </h1>
  );
};

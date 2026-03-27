"use client";
import * as React from "react";
import { cn } from "@/lib/utils"; 
import { motion } from "framer-motion";
import Link from "next/link";

export interface ProductCardProps {
  id: string;
  imageUrl: string;
  name: string;
  category: string;
  price: string; // On garde string car Neon renvoie souvent du decimal
  className?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ id, imageUrl, name, category, price, className }, ref) => {
    return (
      <Link href={`/product/${id}`} className="block h-full">
        <motion.div
          ref={ref}
          className={cn(
            "group relative flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-2xl bg-white p-4 text-center transition-all duration-300 ease-in-out hover:shadow-xl border border-zinc-100",
            className
          )}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Product Image - Carré comme demandé */}
          <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-xl bg-zinc-50">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Badge discret style Roadz */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="bg-black text-[10px] text-white px-2 py-1 uppercase font-bold tracking-tighter rounded">
                 Découvrir
               </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-grow flex-col items-center gap-1">
            <h3 className="font-black uppercase italic tracking-tighter text-lg leading-none">
              {name}
            </h3>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
              {category.split(',')[0]} {/* Prend le 1er mot (tshirt, hoodie...) */}
            </p>
          </div>

          {/* Pricing */}
          <div className="mt-4 flex flex-col items-center">
            <span className="text-xl font-black text-black">
              {price} <small className="text-[10px] ml-0.5">DA</small>
            </span>
          </div>
        </motion.div>
      </Link>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
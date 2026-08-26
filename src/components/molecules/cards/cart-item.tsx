"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { FC } from "react";

import { QuantityControls } from "@/components/atoms/quantity-controls";
import type { CartItem } from "@/stores/cart";
import { useCartStore } from "@/stores/cart";
import { cn, formatPrice } from "@/utils/common";

type Props = {
  item: CartItem;
  className?: string;
};

export const CartItemCard: FC<Props> = ({ item, className }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const totalPrice = item.price * item.quantity;

  return (
    <div
      className={cn(
        "relative flex gap-3 pt-3 pb-3 sm:gap-4 sm:pt-4 sm:pb-4",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-white sm:w-20">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-contain p-1.5 sm:p-2"
          sizes="(max-width: 640px) 64px, 80px"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
        {/* Name and Unit Price Row */}
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
            <Link href={`/products/${item.id}`}>
              <h4 className="font-montserrat text-primary hover:text-secondary text-xs leading-tight font-medium transition-colors sm:text-sm">
                {item.name}
              </h4>
            </Link>
            {/* Variant Label - can be added to CartItem type later */}
            <span className="font-montserrat bg-secondary inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium text-white sm:px-3 sm:py-1 sm:text-xs">
              15ml
            </span>
          </div>
          <span className="font-montserrat text-primary shrink-0 text-xs font-medium sm:text-sm">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Quantity Controls and Total Price Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Quantity Controls */}
          <QuantityControls
            value={item.quantity}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            min={1}
          />

          {/* Total Price and Remove Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-montserrat text-primary text-xs font-medium sm:text-sm">
              {formatPrice(totalPrice)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-primary/60 hover:text-primary flex h-5 w-5 items-center justify-center transition-colors sm:h-6 sm:w-6"
              aria-label="Xóa sản phẩm"
            >
              <Trash2 className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

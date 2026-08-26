"use client";

import NextLink from "next/link";
import { ShoppingCart, XIcon } from "lucide-react";
import type { FC } from "react";

import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { Paragraph } from "@/components/atoms/paragraph";
import { CartItemCard } from "@/components/molecules/cards/cart-item";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { PATH } from "@/constants/path";
import { useCartItemCount, useCartStore, useCartSubtotal } from "@/stores/cart";
import { cn, formatPrice } from "@/utils/common";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import styles from "@/styles/cart.module.css";

const CartHeader: FC = () => {
  const itemCount = useCartItemCount();

  return (
    <div className="flex items-center justify-between border-b border-black/10 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Heading level={3} className="text-black">
          Giỏ hàng
        </Heading>
        <Badge count={itemCount} />
      </div>
      <DialogClose asChild>
        <button
          type="button"
          className="text-gray transition-opacity hover:opacity-80"
          aria-label="Đóng giỏ hàng"
        >
          <XIcon className="size-6" />
        </button>
      </DialogClose>
    </div>
  );
};

const CartItemsList: FC = () => {
  const { items } = useCartStore();

  if (!items || items.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="text-gray/40">
            <ShoppingCart className="size-16" strokeWidth={1.5} />
          </div>
          <Paragraph level={1} className="text-gray">
            Giỏ hàng của bạn đang trống
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:gap-4">
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            className="border-beige border-b last:border-b-0"
          />
        ))}
      </div>
    </div>
  );
};

const CartFooter: FC = () => {
  const { items, clearCart, closeCart } = useCartStore();
  const subtotal = useCartSubtotal();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-black/10 p-4 sm:p-6">
      {/* Subtotal */}
      <div className="mb-6 flex items-center justify-between">
        <Paragraph level={1} className="text-black">
          Tổng tiền
        </Paragraph>
        <Heading level={2} className="text-secondary">
          {formatPrice(subtotal)}
        </Heading>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <NextLink href={PATH.orders.vi} onClick={closeCart}>
          <Button className="w-full uppercase">Thanh toán</Button>
        </NextLink>
        <Button
          variant="outline"
          className="w-full uppercase"
          onClick={clearCart}
        >
          Xóa giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export const Cart: FC = () => {
  const { isOpen, closeCart } = useCartStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeCart}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-4 right-4 z-50 h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg",
            "bg-background-1 border-l border-black/10 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300"
          )}
        >
          <DialogTitle className="sr-only">Giỏ hàng</DialogTitle>
          <div className={cn("flex h-full flex-col", styles.cart)}>
            <CartHeader />
            <CartItemsList />
            <CartFooter />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

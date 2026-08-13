import Link from "next/link";
import type { FC } from "react";

import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Paragraph } from "@/components/atoms/paragraph";
import { PATH } from "@/constants/path";

export const HeroSection: FC = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 text-emerald-50">
      <Container className="py-16 md:py-24">
        <p className="text-sm tracking-[0.2em] text-emerald-200/90 uppercase">
          La Verte Home
        </p>
        <Heading level={1} className="mt-4 max-w-3xl text-4xl md:text-5xl">
          Homestay xanh — đặt theo giờ, qua đêm hoặc cả ngày
        </Heading>
        <Paragraph level={1} className="mt-4 max-w-2xl text-emerald-100/90">
          Chọn khung giờ phù hợp, điền tên và số điện thoại, thanh toán VietQR
          để giữ chỗ ngay. Không cần tạo tài khoản.
        </Paragraph>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={PATH.book}>
            <Button variant="secondary" shape="pill" arrow>
              Bắt đầu đặt phòng
            </Button>
          </Link>
          <Link href={PATH.adminLogin}>
            <Button variant="beige-outline" shape="pill">
              Admin
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

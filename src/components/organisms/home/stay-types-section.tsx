import type { FC } from "react";

import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Paragraph } from "@/components/atoms/paragraph";

const ITEMS = [
  {
    title: "Theo giờ",
    body: "Linh hoạt cho họp nhóm, chụp hình hoặc nghỉ ngắn trong ngày.",
  },
  {
    title: "Qua đêm",
    body: "Khung giá cố định cho lưu trú buổi tối — check-in/check-out rõ ràng.",
  },
  {
    title: "Theo ngày",
    body: "Thuê trọn ngày cho staycation hoặc làm việc tập trung.",
  },
];

export const StayTypesSection: FC = () => {
  return (
    <section className="py-16">
      <Container>
        <Heading level={2} className="text-3xl text-emerald-950">
          Hình thức lưu trú
        </Heading>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <Heading level={3} className="text-xl text-emerald-900">
                {item.title}
              </Heading>
              <Paragraph level={1} className="mt-2 text-emerald-800/80">
                {item.body}
              </Paragraph>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

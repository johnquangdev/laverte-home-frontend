import type { StaticImageData } from "next/image";

import blog1 from "@/assets/imgs/home/blog-1.webp";
import blog2 from "@/assets/imgs/home/blog-2.webp";
import blog3 from "@/assets/imgs/home/blog-3.webp";
import { HomeBlogTeaser } from "@/components/molecules/cards/home-blog-teaser";
import { HOME_COPY } from "@/constants/home";
import { PATH } from "@/constants/path";
import { cn } from "@/utils/common";

/** Static placeholders until CMS/API is wired — swap copy/images in constants when ready. */
const STATIC_FEATURED_BLOGS: Array<{
  post_id: number;
  title: string;
  slug: string;
  image: StaticImageData;
}> = [
  {
    post_id: 1,
    title: "Khi không gian cũng có một cảm xúc riêng",
    slug: "chon-mui-huong",
    image: blog1,
  },
  {
    post_id: 2,
    title: "Khi ở nhà cũng có thể là một cuộc hẹn",
    slug: "gu-thom",
    image: blog2,
  },
  {
    post_id: 3,
    title: "Bắt đầu từ cảm giác bạn muốn hiện tại",
    slug: "bat-dau-tu-cam-giac",
    image: blog3,
  },
];

export const HomeBlogPreview = () => {
  return (
    <section className="border-primary bg-background-2 border-b py-12 md:py-16 lg:py-0">
      <div className="w-full px-4 md:px-10 lg:px-[40px] lg:py-[60px]">
        <h2 className="sr-only">{HOME_COPY.blog.sectionScreenReaderTitle}</h2>
        <div
          className={cn(
            "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            "lg:grid lg:snap-none lg:grid-cols-3 lg:items-start lg:overflow-visible lg:px-0 lg:pb-0"
          )}
        >
          {STATIC_FEATURED_BLOGS.map((blog) => (
            <HomeBlogTeaser
              key={blog.post_id}
              className="w-[min(78vw,300px)] flex-none shrink-0 snap-start snap-always lg:w-full"
              item={{
                postId: blog.post_id,
                title: blog.title,
                href: PATH.blogs._slug.vi(blog.slug),
                image: blog.image,
                imageAlt: blog.title,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

import type { StaticImageData } from "next/image";
import Image from "next/image";
import NextLink from "next/link";
import { ImageIcon } from "lucide-react";
import type { FC } from "react";

import { cn } from "@/utils/common";

export type HomeBlogTeaserItem = {
  postId: number;
  title: string;
  href: string;
  image?: string | StaticImageData | null;
  imageAlt: string;
};

type Props = {
  item: HomeBlogTeaserItem;
  className?: string;
};

export const HomeBlogTeaser: FC<Props> = ({ item, className }) => {
  return (
    <NextLink
      href={item.href}
      className={cn(
        "group flex min-h-[44px] min-w-0 flex-1 flex-col gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black",
        className
      )}
      data-testid={`home-blog-teaser-${item.postId}`}
    >
      <div className="bg-background-1 relative aspect-[390/487] w-full overflow-hidden">
        {item.image ? (
          <Image
            alt={item.imageAlt}
            src={item.image}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
            sizes="(min-width: 1024px) 390px, 100vw"
          />
        ) : (
          <div className="text-secondary flex h-full w-full items-center justify-center">
            <ImageIcon size={48} strokeWidth={1.5} />
          </div>
        )}
      </div>
      <p
        className={cn(
          "font-playfair text-gray text-left text-[1.25rem] leading-[1.25] font-normal tracking-[-0.02em] underline decoration-from-font underline-offset-[0.2em]",
          "group-hover:text-primary transition-colors"
        )}
      >
        {item.title}
      </p>
    </NextLink>
  );
};

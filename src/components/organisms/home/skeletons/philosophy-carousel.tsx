import { Container } from "@/components/atoms/container";
import { Skeleton } from "@/components/atoms/skeleton";

export const PhilosophyCarouselSkeleton = () => {
  return (
    <section className="border-primary bg-background-2 border-b">
      <Container className="flex max-w-[1280px] flex-col gap-10 px-5 py-12 md:px-10 md:py-16 lg:flex-row lg:items-stretch lg:justify-between lg:gap-0 lg:py-0 lg:pr-0 lg:pl-[40px]">
        <div className="flex w-full flex-col items-center gap-10 self-center lg:w-[470px] lg:shrink-0 lg:justify-center lg:self-stretch lg:pr-5">
          <div className="flex w-full flex-col items-center gap-2">
            <Skeleton className="h-10 w-full max-w-[360px]" />
            <Skeleton className="h-10 w-full max-w-[300px]" />
            <Skeleton className="h-10 w-full max-w-[360px]" />
          </div>
          <Skeleton className="h-10 w-52 rounded-full" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col lg:max-w-[754px] lg:pt-[60px] lg:pb-20">
          <div className="mb-5 flex h-5 items-center justify-start">
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            <Skeleton className="h-[450px] w-[300px] shrink-0 rounded-sm" />
            <Skeleton className="h-[450px] w-[300px] shrink-0 rounded-sm" />
            <Skeleton className="h-[450px] w-[300px] shrink-0 rounded-sm" />
          </div>
        </div>
      </Container>
    </section>
  );
};

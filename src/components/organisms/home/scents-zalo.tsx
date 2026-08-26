import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Paragraph } from "@/components/atoms/paragraph";
import { HOME_COPY } from "@/constants/home";
import { INFO } from "@/constants/info";

export const HomeScentsZalo = () => {
  return (
    <section className="bg-background-1 py-12 md:py-16" id="ve-mui-huong">
      <Container className="mx-auto max-w-2xl text-center">
        <Heading level={2} className="mb-4 text-black">
          {HOME_COPY.scentsZalo.title}
        </Heading>
        <Paragraph level={1} className="text-gray mb-8">
          {HOME_COPY.scentsZalo.body}
        </Paragraph>
        <a
          href={INFO.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button variant="secondary">{HOME_COPY.scentsZalo.cta}</Button>
        </a>
      </Container>
    </section>
  );
};

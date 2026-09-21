import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Verte Home",
    short_name: "La Verte",
    description: "Homestay theo giờ, qua đêm hoặc theo ngày tại Bảo Lộc.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f3ef",
    theme_color: "#5b4432",
    lang: "vi",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

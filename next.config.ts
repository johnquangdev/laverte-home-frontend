import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  rewrites() {
    return [
      {
        source: "/dat-phong",
        destination: "/book",
      },
      {
        source: "/admin/dang-nhap",
        destination: "/admin/login",
      },
    ];
  },
};

export default nextConfig;

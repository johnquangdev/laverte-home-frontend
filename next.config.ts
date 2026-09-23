import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "guscent-cdn-api.sfast.vn" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "usflash.vccloud.vn" },
      { protocol: "https", hostname: "mmgroup.vn" },
      { protocol: "https", hostname: "bs-uploads.toptal.io" },
    ],
  },
  // The admin has no index page of its own; /admin is the address people type
  // and where cms.laverte.vn redirects to.
  redirects() {
    return [
      { source: "/admin", destination: "/admin/bookings", permanent: false },
    ];
  },
  rewrites() {
    return [
      { source: "/dat-phong", destination: "/book" },
      { source: "/admin/dang-nhap", destination: "/admin/login" },
      { source: "/bo-suu-tap/:slug*", destination: "/collections/:slug*" },
      {
        source: "/bai-viet/danh-muc/:slug*",
        destination: "/blogs/categories/:slug*",
      },
      { source: "/bai-viet/tag/:slug*", destination: "/blogs/tags/:slug*" },
      { source: "/bai-viet/:slug*", destination: "/blogs/:slug*" },
      {
        source: "/trac-nghiem/lam-bai/:slug*",
        destination: "/quizzes/doing/:slug*",
      },
      {
        source: "/trac-nghiem/ket-qua/:slug*",
        destination: "/quizzes/result/:slug*",
      },
      { source: "/trac-nghiem/:slug*", destination: "/quizzes/:slug*" },
      { source: "/ve-la-verte/:slug*", destination: "/about/:slug*" },
      { source: "/ve-guscent/:slug*", destination: "/about/:slug*" },
      { source: "/tuyen-dung/:slug*", destination: "/recruitment/:slug*" },
      { source: "/mui-huong/:slug*", destination: "/scents/:slug*" },
      { source: "/don-hang", destination: "/orders" },
      { source: "/don-hang/:slug*", destination: "/orders/:slug*" },
      { source: "/chinh-sach", destination: "/policies" },
      { source: "/chinh-sach/thanh-toan", destination: "/policies/payment" },
      { source: "/chinh-sach/van-chuyen", destination: "/policies/shipping" },
      { source: "/chinh-sach/doi-tra", destination: "/policies/return" },
      { source: "/chinh-sach/hoan-tien", destination: "/policies/refund" },
      { source: "/chinh-sach/khieu-nai", destination: "/policies/complaints" },
      { source: "/chinh-sach/bao-mat", destination: "/policies/privacy" },
      {
        source: "/chinh-sach/dieu-khoan-su-dung",
        destination: "/policies/terms",
      },
    ];
  },
};

export default nextConfig;

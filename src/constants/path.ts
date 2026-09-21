/**
 * Pathname constants for all pages in the application.
 * Includes both Vietnamese (rewritten) and English (original) URLs.
 */

class Path {
  home = "/" as const;

  // La Verte booking (added for homestay domain)
  book = {
    vi: "/dat-phong" as const,
    en: "/book" as const,
  };

  admin = {
    login: {
      vi: "/admin/dang-nhap" as const,
      en: "/admin/login" as const,
    },
    callback: "/admin/auth/callback" as const,
    bookings: "/admin/bookings" as const,
    overview: "/admin/overview" as const,
    rooms: "/admin/rooms" as const,
    pricing: "/admin/pricing" as const,
    blockedSlots: "/admin/blocked-slots" as const,
    payments: "/admin/payments" as const,
    sepay: "/admin/sepay" as const,
    settings: "/admin/settings" as const,
  };

  // Collections
  collections = {
    vi: "/bo-suu-tap" as const,
    en: "/collections" as const,
    get _slug() {
      return {
        vi: (slug: string) => `${this.vi}/${slug}` as const,
        en: (slug: string) => `${this.en}/${slug}` as const,
      };
    },
  };

  // Blogs
  blogs = {
    vi: "/bai-viet" as const,
    en: "/blogs" as const,
    categories: {
      vi: "/bai-viet/danh-muc" as const,
      en: "/blogs/categories" as const,
      get _slug() {
        return {
          vi: (slug: string) => `${this.vi}/${slug}` as const,
          en: (slug: string) => `${this.en}/${slug}` as const,
        };
      },
    },
    tags: {
      vi: "/bai-viet/tag" as const,
      en: "/blogs/tags" as const,
      get _slug() {
        return {
          vi: (slug: string) => `${this.vi}/${slug}` as const,
          en: (slug: string) => `${this.en}/${slug}` as const,
        };
      },
    },
    get _slug() {
      return {
        vi: (slug: string) => `${this.vi}/${slug}` as const,
        en: (slug: string) => `${this.en}/${slug}` as const,
      };
    },
  };

  // Quizzes
  quizzes = {
    vi: "/trac-nghiem" as const,
    en: "/quizzes" as const,
    doing: {
      vi: "/trac-nghiem/lam-bai" as const,
      en: "/quizzes/doing" as const,
    },
    result: {
      vi: "/trac-nghiem/ket-qua" as const,
      en: "/quizzes/result" as const,
    },
  };

  // About
  about = {
    vi: "/ve-la-verte" as const,
    en: "/about" as const,
  };

  // Orders
  orders = {
    vi: "/don-hang" as const,
    en: "/orders" as const,
    get _id() {
      return {
        vi: (id: string) => `${this.vi}/${id}` as const,
        en: (id: string) => `${this.en}/${id}` as const,
      };
    },
  };

  // Policies
  policies = {
    vi: "/chinh-sach" as const,
    en: "/policies" as const,
    payment: {
      vi: "/chinh-sach/thanh-toan" as const,
      en: "/policies/payment" as const,
    },
    shipping: {
      vi: "/chinh-sach/van-chuyen" as const,
      en: "/policies/shipping" as const,
    },
    return: {
      vi: "/chinh-sach/doi-tra" as const,
      en: "/policies/return" as const,
    },
    refund: {
      vi: "/chinh-sach/hoan-tien" as const,
      en: "/policies/refund" as const,
    },
    complaints: {
      vi: "/chinh-sach/khieu-nai" as const,
      en: "/policies/complaints" as const,
    },
    privacy: {
      vi: "/chinh-sach/bao-mat" as const,
      en: "/policies/privacy" as const,
    },
    terms: {
      vi: "/chinh-sach/dieu-khoan-su-dung" as const,
      en: "/policies/terms" as const,
    },
  };

  // Scents
  scents = {
    vi: "/mui-huong" as const,
    en: "/scents" as const,
  };

  // Recruitment
  recruitment = {
    vi: "/tuyen-dung" as const,
    en: "/recruitment" as const,
  };

  isCollectionDetail(pathname: string) {
    return (
      pathname.startsWith(`${this.collections.vi}/`) ||
      pathname.startsWith(`${this.collections.en}/`)
    );
  }

  isHeroOverlay(pathname: string) {
    return (
      pathname.startsWith(this.quizzes.result.en) ||
      pathname.startsWith(this.quizzes.result.vi) ||
      this.isCollectionDetail(pathname)
    );
  }
}

export const PATH = new Path();

const normalizeVietnamPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("84")) {
    return `0${digits.slice(2)}`;
  }

  return digits;
};

export const INFO = {
  company: "La Verte Home",
  slogan: "Homestay ấm cúng tại Bảo Lộc",
  phone: "0372 xxx xxx",
  email: "hello@laverte-home.vn",
  address: "Bảo Lộc, Lâm Đồng",
  website: "laverte-home.vn",

  get zaloPhone() {
    if (/x/i.test(this.phone)) return "";
    return normalizeVietnamPhone(this.phone);
  },

  get zaloLink() {
    return this.zaloPhone ? `https://zalo.me/${this.zaloPhone}` : "#";
  },

  get formattedPhone() {
    if (/x/i.test(this.phone)) return this.phone;
    return this.zaloPhone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  },
} as const;

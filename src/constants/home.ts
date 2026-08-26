/** PM: set exact collection codes when known; empty = first 4 by display_order */
export const HOME_CAROUSEL_COLLECTION_CODES: string[] = [];

export const QUIZ_COMPLETED_STORAGE_KEY = "laverte-quiz-completed";

export const HOME_COPY = {
  hero: {
    estLabel: "EST 2026",
    wordmark: "La Verte",
    taglineLine2: "Những căn home dành cho hai người tại Bảo Lộc.",
    cta: "Khám phá không gian →",
  },
  philosophy: {
    line1a: "Không bắt đầu từ một căn home.",
    line1b: "",
    line2a: "Laverte bắt đầu từ",
    leadEmphasis: "cảm giác",
    leadAfter: "hai bạn muốn tìm về.",
    cta: "Khám phá không gian phù hợp →",
  },
  manifesto: {
    lead: "Từ một cảm giác, tìm về một không gian.",
    stanza: [
      "Có những ngày hai người muốn chậm lại.",
      "Có những ngày chỉ muốn nghe tiếng mưa ngoài hiên,",
      "mở cửa đón một chút thiên nhiên,",
      "hoặc đơn giản là khép lại thế giới bên ngoài.",
    ],
    closing: [
      "Laverte chọn những không gian khác nhau,",
      "để mỗi lần tìm về, hai người đều có thể tìm thấy",
      "một nơi vừa vặn với mình.",
    ],
  },
  blog: {
    sectionScreenReaderTitle: "Bài viết",
  },
  scentsZalo: {
    title: "Về mùi hương",
    body: "Bạn muốn được tư vấn trực tiếp về bộ mùi và cách dùng? Nhắn La Verte qua Zalo — chúng tôi sẽ gợi ý theo trạng thái và gu của bạn.",
    cta: "Liên hệ Zalo",
  },
} as const;

export const HOME_PHILOSOPHY_CARDS = [
  {
    title: "Chậm Lại",
    body: "Để những ngày bên nhau trôi qua thật chậm.",
    imageAlt: "Khoảnh khắc chậm rãi bên nhau trong không gian yên tĩnh.",
  },
  {
    title: "Thiên Nhiên",
    body: "Giữa những tán cây, những cơn mưa và làn sương dịu nhẹ.",
    imageAlt: "Thiên nhiên xanh mát với cây cối và sương mù nhẹ.",
  },
  {
    title: "Gần Gũi",
    body: "Một không gian ấm áp cho những khoảnh khắc chỉ thuộc về hai người.",
    imageAlt: "Không gian ấm áp, gần gũi dành cho hai người.",
  },
  {
    title: "Riêng Tư",
    body: "Khép lại thế giới bên ngoài, giữ lại một khoảng riêng cho hai người.",
    imageAlt: "Không gian riêng tư, tách biệt khỏi thế giới bên ngoài.",
  },
] as const;

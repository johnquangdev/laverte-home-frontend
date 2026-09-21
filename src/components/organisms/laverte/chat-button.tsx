import type { FC } from "react";

export const ChatButton: FC = () => {
  return (
    <button
      className="chat-button"
      type="button"
      aria-label="Trò chuyện với La Verte"
    >
      ≡
    </button>
  );
};

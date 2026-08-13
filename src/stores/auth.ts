import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SessionEntity, UserEntity } from "@/types/api/entities";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: UserEntity | null;
  setSession: (session: SessionEntity) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      setSession: (session) =>
        set({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: Date.now() + session.expires_in * 1000,
          user: session.user,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          user: null,
        }),
    }),
    { name: "laverte-auth" }
  )
);

export const selectAccessToken = (state: AuthState): string | null =>
  state.accessToken;

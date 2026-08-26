"use client";

import axios from "axios";

import { useAuthStore } from "@/stores/auth";
import type { SessionEntity } from "@/types/api/entities";

export const internalAxiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

internalAxiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = (): Promise<string | null> => {
  const { refreshToken, setSession, clearSession } = useAuthStore.getState();
  if (!refreshToken) {
    clearSession();
    return Promise.resolve(null);
  }

  if (!refreshPromise) {
    refreshPromise = internalAxiosClient
      .post<SessionEntity>("/auth/refresh", {
        refresh_token: refreshToken,
      })
      .then((response) => {
        setSession(response.data);
        return response.data.access_token;
      })
      .catch(() => {
        clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

internalAxiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return internalAxiosClient(originalRequest);
  }
);

export const externalAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROOT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

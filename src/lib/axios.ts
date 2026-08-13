"use client";

import axios from "axios";

import { useAuthStore } from "@/stores/auth";

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

export const externalAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROOT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

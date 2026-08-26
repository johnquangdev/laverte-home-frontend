import { NextResponse } from "next/server";

import { proxyError } from "@/lib/bff-auth";

export const POST = async (request: Request) => {
  try {
    const payload = await request.json();
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.post("/auth/refresh", payload);
    return NextResponse.json(response);
  } catch (error) {
    return proxyError(error, "Refresh session failed", 401);
  }
};

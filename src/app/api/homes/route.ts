import { NextResponse } from "next/server";

import { proxyError } from "@/lib/bff-auth";

export const GET = async () => {
  try {
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.get("/homes");
    return NextResponse.json(response);
  } catch (error) {
    return proxyError(error, "List homes failed");
  }
};

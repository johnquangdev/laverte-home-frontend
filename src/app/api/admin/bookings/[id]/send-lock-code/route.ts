import { NextResponse } from "next/server";

import { bearerToken, proxyError } from "@/lib/bff-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const POST = async (request: Request, context: RouteContext) => {
  try {
    const token = bearerToken(request);
    const { id } = await context.params;
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.post(
      `/admin/bookings/${id}/send-lock-code`,
      {},
      { token }
    );
    return NextResponse.json(response);
  } catch (error) {
    return proxyError(error, "Send lock code failed", 401);
  }
};

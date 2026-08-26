import { NextResponse } from "next/server";

import { bearerToken, proxyError } from "@/lib/bff-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = async (request: Request, context: RouteContext) => {
  try {
    const token = bearerToken(request);
    const { id } = await context.params;
    const payload = await request.json();
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.patch(
      `/admin/bookings/${id}/lock-code`,
      payload,
      { token }
    );
    return NextResponse.json(response);
  } catch (error) {
    return proxyError(error, "Set lock code failed", 401);
  }
};

import { NextResponse } from "next/server";

import { bearerToken, proxyError } from "@/lib/bff-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const proxyPatch = async (
  request: Request,
  context: RouteContext,
  upstreamPath: string,
  body?: unknown
) => {
  try {
    const token = bearerToken(request);
    const { id } = await context.params;
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.patch(
      `/admin/bookings/${id}/${upstreamPath}`,
      body ?? {},
      { token }
    );
    return NextResponse.json(response);
  } catch (error) {
    return proxyError(error, "Booking action failed", 401);
  }
};

export const PATCH = (request: Request, context: RouteContext) =>
  proxyPatch(request, context, "cancel");

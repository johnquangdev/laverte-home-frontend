import { NextResponse } from "next/server";

const bearerToken = (request: Request): string | undefined => {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice("Bearer ".length);
};

export const GET = async (request: Request) => {
  try {
    const token = bearerToken(request);
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.get(
      `/admin/bookings${query ? `?${query}` : ""}`,
      {
        token,
      }
    );
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "List bookings failed";
    return NextResponse.json({ message }, { status: 401 });
  }
};

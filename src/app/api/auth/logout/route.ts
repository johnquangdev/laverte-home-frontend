import { NextResponse } from "next/server";

const bearerToken = (request: Request): string | undefined => {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice("Bearer ".length);
};

export const POST = async (request: Request) => {
  try {
    const token = bearerToken(request);
    const { httpClient } = await import("@/utils/http-client");
    await httpClient.post("/auth/logout", {}, { token });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed";
    return NextResponse.json({ message }, { status: 401 });
  }
};

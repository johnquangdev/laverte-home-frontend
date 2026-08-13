import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const payload = await request.json();
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.post("/auth/google/callback", payload);
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Google callback failed";
    return NextResponse.json({ message }, { status: 401 });
  }
};

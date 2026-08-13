import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.get<{ url: string }>(
      "/auth/google/login-url"
    );
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login URL failed";
    return NextResponse.json({ message }, { status: 500 });
  }
};

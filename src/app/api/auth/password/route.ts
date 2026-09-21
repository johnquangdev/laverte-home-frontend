import { NextResponse } from "next/server";

// Mirrors the backend's LOCAL_ADMIN_* login. Gated on the server too, so the
// route 404s in any deployment that didn't opt in — a client-only flag would
// still leave the proxy reachable.
export const POST = async (request: Request) => {
  if (process.env.NEXT_PUBLIC_DEV_PASSWORD_LOGIN !== "true") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.post("/auth/password", payload);
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Password login failed";
    return NextResponse.json({ message }, { status: 401 });
  }
};

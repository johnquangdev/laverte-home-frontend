import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const payload = await request.json();
    const { httpClient } = await import("@/utils/http-client");
    const response = await httpClient.post("/bookings", payload);
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Create booking failed";
    return NextResponse.json({ message }, { status: 400 });
  }
};

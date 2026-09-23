import { proxyToApi } from "@/lib/bff-proxy";

// Mirrors the backend's LOCAL_ADMIN_* login. Gated on the server too, so the
// route 404s in any deployment that didn't opt in — a client-only flag would
// still leave the proxy reachable.
export const POST = (request: Request) => {
  if (process.env.NEXT_PUBLIC_DEV_PASSWORD_LOGIN !== "true") {
    return Response.json({ message: "Not found" }, { status: 404 });
  }
  return proxyToApi(request, "auth/password");
};

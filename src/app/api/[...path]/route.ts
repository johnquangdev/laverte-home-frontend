import { proxyToApi } from "@/lib/bff-proxy";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const handler = async (request: Request, context: RouteContext) => {
  const { path } = await context.params;
  // A dot segment would let the URL climb out of the API root once fetch
  // normalises it.
  if (path.some((segment) => segment === "." || segment === "..")) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }
  return proxyToApi(request, path.map(encodeURIComponent).join("/"));
};

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};

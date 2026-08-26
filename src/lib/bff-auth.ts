export const bearerToken = (request: Request): string | undefined => {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice("Bearer ".length);
};

export const proxyError = (error: unknown, fallback: string, status = 400) => {
  const message = error instanceof Error ? error.message : fallback;
  return Response.json({ message }, { status });
};

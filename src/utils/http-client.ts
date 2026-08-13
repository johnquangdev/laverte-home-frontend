interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: string;
  token?: string;
}

type ApiErrorBody = {
  message?: string;
  code?: string;
  error?: string;
};

class HttpClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    if (!baseUrl) {
      throw new Error("Missing API_ROOT environment variable for HttpClient");
    }

    this.baseUrl = baseUrl;
    this.token = token;
  }

  setToken(token?: string): void {
    this.token = token;
  }

  private createURL(endPoint: string, query?: string): string {
    return `${this.baseUrl}${endPoint}${query ? `?${query}` : ""}`;
  }

  private async request<TData, TBody = unknown>(
    method: string,
    endPoint: string,
    options: RequestOptions = {},
    body?: TBody
  ): Promise<TData> {
    const url = this.createURL(endPoint, options.query);
    const token = options.token || this.token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
      cache: "no-cache",
      ...options,
    });

    if (!response.ok) {
      const withErrorResponse = (await response
        .json()
        .catch(() => ({}))) as ApiErrorBody;
      const errorMessage =
        withErrorResponse.message ??
        withErrorResponse.error ??
        `Request to ${url} failed with status ${response.status}`;

      throw new Error(errorMessage);
    }

    return response.json() as Promise<TData>;
  }

  get<TData>(endPoint: string, options?: RequestOptions): Promise<TData> {
    return this.request<TData>("GET", endPoint, options);
  }

  post<TData, TBody>(
    endPoint: string,
    body: TBody,
    options?: RequestOptions
  ): Promise<TData> {
    return this.request<TData, TBody>("POST", endPoint, options, body);
  }

  put<TData, TBody>(
    endPoint: string,
    body: TBody,
    options?: RequestOptions
  ): Promise<TData> {
    return this.request<TData, TBody>("PUT", endPoint, options, body);
  }

  patch<TData, TBody>(
    endPoint: string,
    body: TBody,
    options?: RequestOptions
  ): Promise<TData> {
    return this.request<TData, TBody>("PATCH", endPoint, options, body);
  }

  delete<TData>(endPoint: string, options?: RequestOptions): Promise<TData> {
    return this.request<TData>("DELETE", endPoint, options);
  }
}

export const httpClient = new HttpClient(process.env.API_ROOT!);

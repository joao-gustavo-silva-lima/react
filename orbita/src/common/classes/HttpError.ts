export default class HttpError extends Error {
  public status: number;
  public code: string;
  public rawError?: Error | undefined;
  public details?: Record<string, string> | undefined;

  public constructor(
    status: number,
    code: string,
    message: string,
    rawError?: Error,
    details?: Record<string, string>,
    options?: ErrorOptions | undefined,
  ) {
    super(message, options);

    this.code = code;
    this.status = status;
    this.details = details;
    this.name = "HttpError";
    this.rawError = rawError;
  }
}

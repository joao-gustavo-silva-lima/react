export class StatefulError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly appendix?: Record<string, string>;

  public constructor(
    code: string,
    status: number,
    message: string,
    appendix?: Record<string, string>,
    options?: ErrorOptions | undefined,
  ) {
    super(message, options);

    this.code = code;
    this.status = status;
    this.appendix = appendix;
  }
}

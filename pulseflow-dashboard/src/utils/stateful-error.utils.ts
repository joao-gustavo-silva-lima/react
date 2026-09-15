export class StatefulError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly appendix?: { [k: string]: unknown };

  public constructor(
    code: string,
    status: number,
    message: string,
    appendix?: { [k: string]: unknown },
    options?: ErrorOptions | undefined,
  ) {
    super(message, options);

    this.code = code;
    this.status = status;
    this.appendix = appendix;
  }
}

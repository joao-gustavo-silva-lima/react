export class StatefulError extends Error {
  public readonly status: number;
  public readonly appendix?: { [k: string]: unknown };

  public constructor(
    status: number,
    message: string,
    appendix?: { [k: string]: unknown },
    options?: ErrorOptions | undefined,
  ) {
    super(message, options);

    this.status = status;
    this.appendix = appendix;
  }
}

export class ManatsuError extends Error {
  public override readonly name: string;
  constructor(message: string) {
    super(message);
    this.name = 'ManatsuError';
  }
}

export class DialogError extends ManatsuError {
  public override readonly name: string;
  constructor(message: string) {
    super(message);
    this.name = 'DialogError';
  }
}

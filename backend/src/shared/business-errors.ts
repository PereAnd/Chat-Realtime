export function BusinessLogicException(message: string, type: number) {
  this.message = message;
  this.type = type;
}

export enum BusinessError {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  PRECONDITION_FAILED,
  INTERNAL_SERVER_ERROR,
}

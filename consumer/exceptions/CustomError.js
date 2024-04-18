import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
  message;
  statusCode;

  constructor(message, statusCode) {
    super(message);
    this.message = "Error - " + message;
    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default CustomError;

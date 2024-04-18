import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

export class NotFoundException extends CustomError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

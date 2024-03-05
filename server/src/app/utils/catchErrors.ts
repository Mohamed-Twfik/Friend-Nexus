import { NextFunction, Request, Response } from "express";
import CustomRequest from "../types/customRequest";
import { ErrorResponse } from "../types/response";

type AsyncFunction = (request: CustomRequest, response: Response, next: NextFunction) => Promise<any>;

export default (fn: AsyncFunction) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    fn(request, response, next).catch((error) => {
      const status = error.status || 500;
      const message = error.message || "Something went wrong";
      const errResponse: ErrorResponse = { status, message };
      next(errResponse);
    });
  };
};
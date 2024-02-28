import { NextFunction, Request, Response } from "express";
import CustomRequest from "../types/customRequest";

type AsyncFunction = (request: CustomRequest, response: Response, next: NextFunction) => Promise<any>;

export default (fn: AsyncFunction) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    fn(request, response, next).catch((error: Error) => {
      next(error);
    });
  };
};
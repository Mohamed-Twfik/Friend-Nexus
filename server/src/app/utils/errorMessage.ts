import {ErrorResponse} from "../types/response";

export default (status: number, message: string, data: any = []) => {
  const error: ErrorResponse = {
    message,
    status,
    data
  };
  return error;
};
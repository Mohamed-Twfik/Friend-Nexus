import {ErrorMessage} from "../types/response";

export default (status: number, message: string) => {
  const error: ErrorMessage = {
    message,
    status,
  };
  return error;
};
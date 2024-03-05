type Response = {
  message: string;
};

export type OKResponse = Response & {
  data?: any;
}

export type ErrorResponse = OKResponse & {
  status: number;
}
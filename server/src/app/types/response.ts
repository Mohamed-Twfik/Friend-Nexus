export type ErrorMessage = {
  message: string;
  status: number;
}

export type Res = {
  message: "Success..!";
}

export type loginRes = Res & {
  token: string;
  userId: string;
}
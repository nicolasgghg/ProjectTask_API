import { Response } from "express";

const handleSuccess = (
  res: Response,
  status: number,
  message?: string,
  data?: any
) => {
  const response: Record<string, any> = {};

  if (message) response.message = message;
  if (data !== undefined) response.data = data;

  res.status(status).json(response);
};

export default handleSuccess;

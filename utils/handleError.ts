import { NextApiResponse } from "next";

export const handleError = (
  res: NextApiResponse,
  error: Error,
  fnc: Function | string
) => {
  const { message = "internal server error", stack } = error;

  res.status(500).json({
    data: null,
    error: {
      message,
      location: typeof fnc === "function" ? fnc.name : fnc,
      stack,
    },
  });
};

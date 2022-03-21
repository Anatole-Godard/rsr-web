import { NextApiResponse } from "next";

/**
 * If an error is thrown,
 * the error is sent to the client with a 500 status code
 * @param {NextApiResponse} res - NextApiResponse
 * @param {Error} error - The error object that was thrown.
 * @param {Function | string} fnc - Function | string
 */
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

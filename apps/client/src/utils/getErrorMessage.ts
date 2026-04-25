import { isAxiosError } from "axios";

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

const normalizeMessage = (message: unknown) => {
  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string") {
    return message;
  }

  return null;
};

export const getErrorMessage = (error: unknown, fallback = "Something went wrong.") => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = normalizeMessage(error.response?.data?.message);

    if (responseMessage) {
      return responseMessage;
    }

    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
};

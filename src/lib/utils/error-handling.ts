import axios, { type AxiosError } from "axios";
import { toast } from "sonner";

interface ErrorResponse {
  error: string;
}

type ErrorHandler = (error: Error) => void;

const formatZodErrors = (zodError: any) => {
  if (!zodError.issues) return "Ocorreu um erro inesperado.";

  const errorMessages = zodError.issues.map((issue: any) => {
    const field = issue.path.join(".");
    let message = "";

    switch (issue.code) {
      case "invalid_type":
        message = issue.message.includes("Required")
          ? `O campo '${field}' é obrigatório.\n`
          : `O campo '${field}' deve ser do tipo ${issue.expected}, foi enviado tipo: ${issue.received}.\n`;
        break;
      default:
        message = `Erro no campo '${field}': ${issue.message}\n`;
    }

    return message;
  });

  return errorMessages.join("\n");
};

export const onError: ErrorHandler = (error) => {
  console.log(error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const _error = axiosError.response?.data.error;

    const errorMessage =
      typeof _error === "string"
        ? _error || "Ocorreu um erro inesperado."
        : formatZodErrors(_error);
    toast.error(errorMessage);
  } else {
    toast.error(error.message || "Ocorreu um erro inesperado.");
  }
};

import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface AlertMessageProps {
  type: "error" | "success";
  message: string;
}

export const AlertMessage = ({ type, message }: AlertMessageProps) => {
  const isError = type === "error";

  return (
    <Alert
      className={`border-${isError ? "red" : "green"}-200 bg-${isError ? "red" : "green"}-50`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 text-red-600" />
      ) : (
        <CheckCircle className="w-4 h-4 text-green-600" />
      )}
      <AlertDescription className={`text-${isError ? "red" : "green"}-700`}>
        {message}
      </AlertDescription>
    </Alert>
  );
};

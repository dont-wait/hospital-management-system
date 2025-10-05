import { forwardRef } from "react";
import { Input } from "@/components/ui/shared/Input";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const UsernameInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          className={error ? "border-red-500 pr-10" : "pr-10"}
        />
      </div>
    );
  },
);

UsernameInput.displayName = "UsernameInput";

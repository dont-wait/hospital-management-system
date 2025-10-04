import { Heart } from "lucide-react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/shared/Card";

export function LoginHeader() {
  return (
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-center mb-4">
        <Heart className="h-10 w-10 text-blue-600" />
      </div>
      <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
      <CardDescription className="text-center">
        Sign in to your MediCare Hospital account
      </CardDescription>
    </CardHeader>
  );
}

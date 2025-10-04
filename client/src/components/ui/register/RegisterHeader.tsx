import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/Card";
import { Heart } from "lucide-react";

export function RegisterHeader() {
  return (
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-center mb-4">
        <Heart className="h-10 w-10 text-blue-600" />
      </div>
      <CardTitle className="text-2xl text-center">Create Account</CardTitle>
      <CardDescription className="text-center">
        Join MediCare Hospital - Register Now!
      </CardDescription>
    </CardHeader>
  );
}

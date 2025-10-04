import Link from "next/link";
import { useRegisterSubmit } from "@/hooks/useRegisterSubmit";
import { Card, CardContent } from "@/components/ui/shared/Card";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterForm } from "./RegisterForm";

function RegisterCard() {
  const { handleSubmit, isLoading } = useRegisterSubmit();

  return (
    <Card className="w-full">
      <RegisterHeader />
      <CardContent className="space-y-6">
        <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegisterCard;

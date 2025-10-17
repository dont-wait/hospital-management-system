import { lazy } from "react";
import { Card, CardContent } from "@/components/ui/shared/Card";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import { useUpdatePatient } from "@/hooks/useUpdatePatient";
import { Patient } from "@/types";

const UpdateForm = lazy(() => import("@/components/ui/patient/UpdateForm"));

function UpdateCard() {
  const { handleSubmit, isLoading } = useUpdatePatient();
  const { user } = useUserAuthContext();

  return (
    <Card className="w-full p-2 shadow-none border-0">
      <CardContent className="space-y-4 w-full md:w-4/6 mx-auto">
        {user && "patientId" in user && (
          <UpdateForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={user as Patient}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default UpdateCard;

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/shared/Card";
import { useAuth } from "@/contexts/AuthContext";
import UpdateForm from "./UpdateForm";
import { PatientUpdateDto } from "@/schemas/patient";

function UpdateCard() {
  const submit = async (patientUpdateDto: PatientUpdateDto) => {
  };

  const { authUser } = useAuth();
  const patient = useMemo(() => {
    if (authUser?.patient) {
      return {
        ...authUser.patient,
        avatarUrl: authUser.avatarUrl,
      };
    }
    return null;
  }, [authUser?.patient, authUser?.avatarUrl]);

  return (
    <Card className="w-full p-2 shadow-none border-0">
      <CardContent className="space-y-4 w-full md:w-4/6 mx-auto">
        {patient && (
          <UpdateForm
            onSubmit={submit}
            isLoading={false}
            initialData={patient}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default UpdateCard;

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/Card";
import { Label } from "@/components/ui/shared/Label";
import { Button } from "@/components/ui/shared/Button";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, User, Mail, Phone } from "@/lib/client/utils";
import PatientDetail from "@/components/ui/patient/PatientDetail";

function PatientInfo() {
  const { authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {authUser?.patient && (
        <PatientDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          patient={authUser.patient}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bệnh nhân</CardTitle>
        </CardHeader>
        {authUser && authUser.patient && (
          <CardContent>
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div
                className="flex items-center rounded border
                  border-gray-300 px-4 py-2 gap-2"
              >
                <User className="h-4 w-4" />
                <Label className="text-sm text-gray-600 block truncate">
                  Tên bệnh nhân:{" "}
                  <span>
                    {authUser.patient.firstName} {authUser.patient.lastName}
                  </span>
                </Label>
              </div>

              {/* Email */}
              <div
                className="flex items-center rounded border
                  border-gray-300 px-4 py-2 gap-2"
              >
                <Mail className="h-4 w-4" />
                <Label className="text-sm text-gray-600 block truncate">
                  Email: <span>{authUser.patient.email}</span>
                </Label>
              </div>

              {/* Contact Number */}
              <div
                className="flex items-center rounded border
                  border-gray-300 px-4 py-2 gap-2"
              >
                <Phone className="mr-2 h-4 w-4" />
                <Label className="text-sm text-gray-600 block truncate">
                  Số điện thoại: <span>{authUser.patient.phoneNumber}</span>
                </Label>
              </div>
            </div>

            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="mr-2 h-4 w-4" />
              Hồ sơ chi tiết
            </Button>
          </CardContent>
        )}
      </Card>
    </>
  );
}

export default PatientInfo;

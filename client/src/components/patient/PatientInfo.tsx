import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/Card";
import { Label } from "@/components/shared/Label";
import { Button } from "@/components/shared/Button";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import { FileText, User, Mail, Phone } from "@/lib/client/utils";
import PatientDetail from "@/components/patient/PatientDetail";
import { Patient } from "@/types";

function PatientInfo() {
  const { user } = useUserAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {user && "patientId" in user && (
        <PatientDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          patient={user as Patient}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bệnh nhân</CardTitle>
        </CardHeader>
        {user && "patientId" in user && (
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
                    {user.firstName} {user.lastName}
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
                  Email: <span>{user.email}</span>
                </Label>
              </div>

              {/* Contact Number */}
              <div
                className="flex items-center rounded border
                  border-gray-300 px-4 py-2 gap-2"
              >
                <Phone className="mr-2 h-4 w-4" />
                <Label className="text-sm text-gray-600 block truncate">
                  Số điện thoại: <span>{user.phoneNumber}</span>
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

"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/Card";
import { Button } from "@/components/ui/shared/Button";
import { Label } from "@/components/ui/shared/Label";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  FileText,
  Pencil,
  User,
  Mail,
  Phone,
} from "@/lib/client/utils";

export default function PatientPage() {
  const { authUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chức năng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Lịch khám
            </Button>
            <Link href="/forgot-password" className="block">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Đổi mật khẩu
              </Button>
            </Link>
            <Link href="/patient/update">
              <Button className="w-full justify-start" variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Cập nhật hồ sơ
              </Button>
            </Link>
          </CardContent>
        </Card>

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
                  border-gray-300 px-4 py-2
                  "
                >
                  <User className="mr-2 h-4 w-4" />
                  <Label className="text-sm text-gray-600">
                    Tên bệnh nhân:{" "}
                    <span>
                      {authUser.patient.firstName} {authUser.patient.lastName}
                    </span>
                  </Label>
                </div>

                {/* Email */}
                <div
                  className="flex items-center rounded border
                  border-gray-300 px-4 py-2
                  "
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <Label className="text-sm text-gray-600">
                    Email: <span>{authUser.patient.email}</span>
                  </Label>
                </div>

                {/* Contact Number */}
                <div
                  className="flex items-center rounded border
                  border-gray-300 px-4 py-2
                  "
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <Label className="text-sm text-gray-600">
                    Số điện thoại: <span>{authUser.patient.phoneNumber}</span>
                  </Label>
                </div>
              </div>

              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Hồ sơ chi tiết
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

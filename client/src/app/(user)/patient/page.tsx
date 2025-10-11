"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/Card";
import { Button } from "@/components/ui/shared/Button";
import { Calendar, FileText, Pencil } from "@/lib/client/utils";
import LazySection from "@/components/ui/shared/LazySection";
import Skeleton from "react-loading-skeleton";

export default function PatientPage() {
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

        <LazySection
          importFunc={() => import("@/components/ui/patient/PatientInfo")}
          skeleton={
            <Card>
              <CardHeader>
                <Skeleton width="40%" height={24} />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="rounded">
                    <Skeleton width="100%" height={36} />
                  </div>
                  <div className="rounded">
                    <Skeleton width="100%" height={36} />
                  </div>
                  <div className="rounded">
                    <Skeleton width="100%" height={36} />
                  </div>
                </div>
                <Skeleton width="100%" height={39} />
              </CardContent>
            </Card>
          }
        />
      </div>
    </div>
  );
}

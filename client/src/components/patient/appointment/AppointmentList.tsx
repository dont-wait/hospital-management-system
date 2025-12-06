"use client";

import { memo, useEffect, useState, useMemo } from "react";
import AppointmentCard from "@/components/patient/appointment/AppointmentCard";
import Pagination from "@/components/shared/Pagination";
import { AppointmentService } from "@/services";
import { useAppointmentManagemnt, useUserAuthContext } from "@/contexts";
import { Appointment, Patient } from "@/types";

interface AppointmentListProps {
  appointments: Appointment[];
  totalPages: number;
}

function AppointmentList({ appointments, totalPages }: AppointmentListProps) {
  const { currentPage, setCurrentPage } = useAppointmentManagemnt();
  const [data, setData] = useState<Appointment[]>(appointments);
  const { user } = useUserAuthContext();
  const patientId = (user as Patient)?.patientId ?? "";
  const currentDate = useMemo(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }, []);

  useEffect(() => {
    async function getData() {
      const response = await AppointmentService.getAppointment(
        patientId,
        currentDate,
        currentPage,
      );

      if (JSON.stringify(data) !== JSON.stringify(response.data))
        setData(response.data);
    }
    getData();
  }, [currentPage]);

  return (
    <>
      <div className="space-y-2">
        {data.length > 0 ? (
          data.map((appointment) => (
            <AppointmentCard
              key={appointment.appointmentId}
              appointment={appointment}
            />
          ))
        ) : (
          <div className="border rounded-md text-center py-8 text-gray-500">
            Không có cuộc hẹn nào
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}

export default memo(AppointmentList);

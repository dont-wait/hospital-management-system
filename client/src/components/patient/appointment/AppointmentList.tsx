"use client";

import { memo, useEffect, useState } from "react";
import AppointmentCard from "@/components/patient/appointment/AppointmentCard";
import Pagination from "@/components/shared/Pagination";
import { AppointmentService } from "@/services";
import { useAppointmentManagemnt } from "@/contexts";
import { Appointment } from "@/types";

interface AppointmentListProps {
  appointments: Appointment[];
  totalPages: number;
}

function AppointmentList({ appointments, totalPages }: AppointmentListProps) {
  const { currentPage } = useAppointmentManagemnt();
  const [data, setData] = useState<Appointment[]>(appointments);

  useEffect(() => {
    async function getData() {
      const response = await AppointmentService.getAppointment(currentPage);
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
          <div className="text-center py-8 text-gray-500">
            Không có cuộc hẹn nào
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/patient/appointments"
        />
      )}
    </>
  );
}

export default memo(AppointmentList);

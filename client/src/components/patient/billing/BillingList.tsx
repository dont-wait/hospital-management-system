"use client";

import { memo, useEffect, useState } from "react";
import BillingCard from "@/components/patient/billing/BillingCard";
import Pagination from "@/components/shared/Pagination";
import { BillingService } from "@/services";
import { useBillingManagemnt, useUserAuthContext } from "@/contexts";
import { Billing, Patient } from "@/types";

interface AppointmentListProps {
  billings: Billing[];
  totalPages: number;
}

function BillingList({ billings, totalPages }: AppointmentListProps) {
  const { currentPage, setCurrentPage } = useBillingManagemnt();
  const [data, setData] = useState<Billing[]>(billings);
  const { user } = useUserAuthContext();
  const patientId = (user as Patient)?.patientId ?? "";

  useEffect(() => {
    async function getData() {
      const response = await BillingService.getBillings(patientId, currentPage);
      setData(response.data);
    }
    getData();
  }, [currentPage]);

  return (
    <>
      <div className="space-y-2">
        {data.length > 0 ? (
          data.map((billing) => (
            <BillingCard key={billing.id} billing={billing} />
          ))
        ) : (
          <div className="border rounded-md text-center py-8 text-gray-500">
            Không có hóa đơn nào
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

export default memo(BillingList);

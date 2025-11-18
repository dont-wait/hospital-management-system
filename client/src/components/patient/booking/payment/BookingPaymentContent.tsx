"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useBookingExamContext } from "@/contexts";
import { paymentMethods } from "@/config";
import { CurrencyUtils } from "@/lib/client";

export default function BookingPaymentContent() {
  const { state } = useBookingExamContext();
  const [insuranceCode, setInsuranceCode] = useState("");
  const [useInsurance, setUseInsurance] = useState(false);
  const validateInsuranceCode = (code: string) => code.length >= 6;
  const handleInsuranceCodeChange = (value: string) => {
    setInsuranceCode(value);
    setUseInsurance(validateInsuranceCode(value));
  };
  const calculatePrices = () => {
    const total = state.records.reduce((sum, r) => sum + r.price, 0);
    const discount = useInsurance ? total * 0.2 : 0;
    const final = total - discount;
    return { total, discount, final };
  };
  const { total, discount, final } = useMemo(calculatePrices, [
    state.records,
    useInsurance,
  ]);

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          value={insuranceCode}
          onChange={(e) => handleInsuranceCodeChange(e.target.value)}
          placeholder="Nhập mã BHYT..."
          className="w-full px-6 py-3 border rounded-sm outline-none"
        />

        {insuranceCode !== "" && (
          <p
            className={`mt-2 text-sm ${
              useInsurance ? "text-green-600" : "text-red-500"
            }`}
          >
            {useInsurance
              ? "Mã BHYT hợp lệ, đã áp dụng giảm giá."
              : "Mã BHYT không hợp lệ."}
          </p>
        )}
      </div>

      <div className="mb-4 border rounded-sm p-6 shadow-sm">
        <div className="flex justify-between mb-2">
          <span>Tổng chi phí</span>
          <span>{CurrencyUtils.formatCurrency(total)}</span>
        </div>

        {useInsurance && (
          <div className="flex justify-between text-martinique mb-2">
            <span>Giảm giá BHYT (20%)</span>
            <span>- {CurrencyUtils.formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-martinique text-lg mt-3">
          <span>Thanh toán</span>
          <span>{CurrencyUtils.formatCurrency(final)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className="w-full px-6 py-2 border rounded-sm shadow-sm flex items-center gap-4"
          >
            <div className="h-12 flex items-center justify-center">
              <Image
                src={method.logo}
                alt={method.name}
                height={40}
                width={method.id === "momo" ? 40 : 80}
                className="aspect-contain"
              />
            </div>

            <span className="font-bold text-martinique">{method.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}

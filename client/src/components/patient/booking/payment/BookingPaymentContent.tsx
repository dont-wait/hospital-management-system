"use client";

import { useMemo, useState } from "react";
import { useBookingExamContext } from "@/contexts";
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
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mã bảo hiểm y tế (BHYT)
        </label>
        <input
          type="text"
          value={insuranceCode}
          onChange={(e) => handleInsuranceCodeChange(e.target.value)}
          placeholder="Nhập mã BHYT..."
          className="w-full px-6 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        {insuranceCode !== "" && (
          <p
            className={`mt-2 text-sm font-medium ${
              useInsurance ? "text-green-600" : "text-red-500"
            }`}
          >
            {useInsurance
              ? "✓ Mã BHYT hợp lệ, đã áp dụng giảm giá."
              : "✗ Mã BHYT không hợp lệ."}
          </p>
        )}
      </div>

      <div className="mb-6 border rounded-lg p-6 shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Chi tiết thanh toán
        </h3>
        <div className="flex justify-between mb-3 text-gray-700">
          <span>Tổng chi phí</span>
          <span className="font-medium">
            {CurrencyUtils.formatCurrency(total)}
          </span>
        </div>
        {useInsurance && (
          <div className="flex justify-between text-green-600 mb-3">
            <span>Giảm giá BHYT (20%)</span>
            <span className="font-medium">
              - {CurrencyUtils.formatCurrency(discount)}
            </span>
          </div>
        )}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold text-indigo-900 text-xl">
            <span>Tổng thanh toán</span>
            <span>{CurrencyUtils.formatCurrency(final)}</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Phương thức thanh toán
        </h3>
        <div className="bg-white rounded-lg p-5 shadow-md border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-base sm:text-lg mb-2">
                Thanh toán tại quầy lễ tân bệnh viện
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Quý khách vui lòng đến quầy lễ tân để hoàn tất thanh toán trước
                khi khám
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-east-bay flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Thanh toán bằng tiền mặt hoặc thẻ</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-east-bay flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Nhận hóa đơn VAT ngay tại quầy</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-east-bay flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Hỗ trợ tư vấn trực tiếp từ nhân viên</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

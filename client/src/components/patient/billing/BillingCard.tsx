"use client";

import Icon from "@/components/shared/Icon";
import { useBillingManagemnt } from "@/contexts";
import { CurrencyUtils } from "@/lib/client/currency-utils";
import { Billing } from "@/types";

interface BillingCardProps {
  billing: Billing;
}

export default function AppointmentCard({ billing }: BillingCardProps) {
  const { setBillingId } = useBillingManagemnt();

  return (
    <div
      onClick={() => {
        setBillingId(billing.id);
      }}
      className="group p-5 border border-silver rounded-lg cursor-pointer 
                 transition-all duration-200 hover:shadow-lg hover:border-east-bay/30
                 hover:-translate-y-0.5 bg-white"
    >
      <div className="space-y-3">
        {/* Mã hóa đơn */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-east-bay/70 font-medium">Mã hóa đơn</p>
            <p className="text-sm font-semibold text-martinique">
              #{billing.id.toString().padStart(6, "0")}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-silver/50"></div>

        {/* Phương thức thanh toán */}
        <div className="flex items-center gap-3 text-east-bay">
          <div className="w-4 h-4">
            <Icon name="Wallet" className="w-4 h-4 flex-shrink-0" />
          </div>
          <span className="text-sm font-medium">{billing.paymentMethod}</span>
        </div>

        {/* Giảm giá */}
        {billing.discountAmount > 0 && (
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-4 h-4">
              <Icon name="SaveOff" className="w-4 h-4 flex-shrink-0" />
            </div>
            <span className="text-sm font-medium">
              Giảm {CurrencyUtils.formatCurrency(billing.discountAmount)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-silver/50"></div>

        {/* Tổng tiền */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-east-bay">
            Tổng cộng:
          </span>
          <span className="text-lg font-bold text-martinique">
            {CurrencyUtils.formatCurrency(billing.paymentAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}

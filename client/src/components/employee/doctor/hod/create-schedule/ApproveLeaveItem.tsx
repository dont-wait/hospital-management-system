'use client';

import styles from "@/styles/create-schedule.module.css";
import { ApproveLeaveItemData } from "@/types";

interface ApproveLeaveItemProps {
    request: ApproveLeaveItemData;
    onApprove?: (request: ApproveLeaveItemData) => void;
    onReject?: (request: ApproveLeaveItemData) => void;
    disabled?: boolean;
    approving?: boolean;
    rejecting?: boolean;
}

function getInitials(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return "BS";

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    const first = parts[0][0] ?? "";
    const last = parts[parts.length - 1][0] ?? "";
    return `${first}${last}`.toUpperCase();
}

function formatLeaveRange(startDate: string, endDate: string, totalDays: number) {
    if (startDate === endDate) {
        return `${startDate} (${totalDays} ngày)`;
    }

    return `${startDate} - ${endDate} (${totalDays} ngày)`;
}

function getLeaveTypeLabel(request: ApproveLeaveItemData) {
    if (request.leaveTypeLabel) return request.leaveTypeLabel;

    switch (request.leaveType) {
        case "annual":
            return "Nghỉ phép năm";
        case "personal":
            return "Nghỉ việc riêng";
        default:
            return "Nghỉ khác";
    }
}


export function ApproveLeaveItem({
    request,
    onApprove,
    onReject,
    disabled = false,
    approving = false,
    rejecting = false,
}: ApproveLeaveItemProps) {
    const leaveTypeClass = styles[`leave-type-${request.leaveType}`];

    return (
        <div className={styles["approve-leave-item-container"]}>
            <div className={styles["approve-leave-item-left"]}>
                <div className={styles["approve-leave-item-avatar"]} aria-hidden="true">
                    {getInitials(request.doctorName)}
                </div>

                <div className={styles["approve-leave-item-info"]}>
                    <p className={styles["approve-leave-item-name"]}>BS. {request.doctorName}</p>
                    <p className={styles["approve-leave-item-period"]}>
                        {formatLeaveRange(request.startDate, request.endDate, request.totalDays)}
                    </p>
                    <span className={`${styles["approve-leave-item-type-badge"]} ${leaveTypeClass}`}>
                        {getLeaveTypeLabel(request)}
                    </span>
                </div>
            </div>

            <div className={styles["approve-leave-item-actions"]}>
                <button
                    type="button"
                    className={styles["approve-leave-reject-btn"]}
                    onClick={() => onReject?.(request)}
                    disabled={disabled || approving || rejecting}
                >
                    {rejecting ? "Đang xử lý..." : "Từ chối"}
                </button>
                <button
                    type="button"
                    className={styles["approve-leave-approve-btn"]}
                    onClick={() => onApprove?.(request)}
                    disabled={disabled || approving || rejecting}
                >
                    {approving ? "Đang xử lý..." : "Duyệt"}
                </button>
            </div>
        </div>
    );
}
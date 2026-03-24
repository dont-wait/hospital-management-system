'use client';
import styles from "@/styles/create-schedule.module.css";
import { ApproveLeaveItemData } from "@/types";
import { CalendarDays, FileUser } from "lucide-react";
import { ApproveLeaveItem } from "./ApproveLeaveItem";

interface ApproveLeaveRequestCardProps {
	requests?: ApproveLeaveItemData[];
	onApprove?: (request: ApproveLeaveItemData) => void;
	onReject?: (request: ApproveLeaveItemData) => void;
	isActionDisabled?: boolean;
}

const mockLeaveRequests: ApproveLeaveItemData[] = [
	{
		requestId: "leave-1",
		doctorName: "Lê Văn Minh",
		startDate: "12/10",
		endDate: "14/10",
		totalDays: 3,
		leaveType: "annual",
		leaveTypeLabel: "Nghỉ phép năm",
	},
	{
		requestId: "leave-2",
		doctorName: "Trần Thị Lan",
		startDate: "15/10",
		endDate: "15/10",
		totalDays: 1,
		leaveType: "personal",
		leaveTypeLabel: "Nghỉ việc riêng",
	},
	{
		requestId: "leave-3",
		doctorName: "Phạm Văn Hùng",
		startDate: "20/10",
		endDate: "22/10",
		totalDays: 3,
		leaveType: "other",
		leaveTypeLabel: "Nghỉ khác",
	}
];

export function ApproveLeaveRequestCard({
	requests = mockLeaveRequests,
	onApprove,
	onReject,
	isActionDisabled = false,
}: ApproveLeaveRequestCardProps) {
	const pendingCount = requests.length;

	return (
		<div className={`${styles["schedule-container"]} ${styles["approve-leave-container"]}`}>
			<div className={`${styles["schedule-container-header"]} ${styles["approve-leave-header"]}`}>
				<div className={styles["approve-leave-title-group"]}>
					<FileUser className={styles["approve-leave-icon"]} /> Phê duyệt nghỉ phép
				</div>
				<div className={styles["schedule-container-header-badge"]}>
					{pendingCount} yêu cầu mới
				</div>
			</div>

			{requests.length === 0 ? (
				<div className={styles["approve-leave-empty-state"]}>
					<CalendarDays className={styles["approve-leave-empty-icon"]} />
					<p className={styles["approve-leave-empty-title"]}>
						Không có yêu cầu nghỉ phép nào đang chờ duyệt.
					</p>
					<p className={styles["approve-leave-empty-subtitle"]}>
						Yêu cầu mới sẽ xuất hiện ở đây khi bác sĩ gửi đơn nghỉ phép.
					</p>
				</div>
			) : (
				requests.map((request) => (
					<ApproveLeaveItem
						key={request.requestId}
						request={request}
						onApprove={onApprove}
						onReject={onReject}
						disabled={isActionDisabled}
					/>
				))
			)}
		</div>
	);
}
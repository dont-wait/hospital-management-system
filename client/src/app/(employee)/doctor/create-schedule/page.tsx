'use client';

import { CreateSheduleHeader } from '@/components/employee/doctor/hod/create-schedule/CreateSheduleHeader';
import { SoftConstraintCard } from '@/components/employee/doctor/hod/create-schedule/SoftConstraintCard';
import { ApproveLeaveRequestCard } from '@/components/employee/doctor/hod/create-schedule/ApproveLeaveRequest';
import { SoftConstraintConfig, SoftConstraintScheduleConfig } from '@/config';
import { PreviewScheduleCard } from '@/components/employee/doctor/hod/create-schedule/PreviewScheduleCard';
import { useForm, FormProvider } from 'react-hook-form';
import styles from "@/styles/create-schedule.module.css";
import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthUserWithoutTokens, CreateScheduleRequest, DoctorRequest, Employee, PreviewScheduleResult } from '@/types';
import { useUserAuthContext } from '@/contexts';
import { EmployeeService } from '@/services/employee.service';
import { toast } from 'react-toastify';
import { DepartmentService } from '@/services/department.service';
import { ScheduleService } from '@/services/schedule.service';
import {
	offReceiveSchedulingUpdate,
	onReceiveSchedulingUpdate,
	startSchedulingConnection,
} from '@/services/signalr.service';

const SOFT_CONSTRAINT_FORM_ID = 'soft-constraint-form';
const SCHEDULE_REQUEST_ID_KEY = "schedule_request_id";
const SCHEDULE_PREVIEW_CACHE_KEY = "schedule_preview_cache";

type ScheduleRealtimePayload = {
	title: string;
	message: string;
	notificationType: string;
	createdAt: string;
	data: {
		requestId?: number | string;
		progressPercent?: number;
		status?: string;
	};
};

type ScheduleRealtimePayloadRaw = {
	title?: string;
	message?: string;
	notificationType?: string;
	createdAt?: string;
	data?: {
		requestId?: number | string;
		progressPercent?: number;
		status?: string;
	};
	Title?: string;
	Message?: string;
	NotificationType?: string;
	CreatedAt?: string;
	Data?: {
		requestId?: number | string;
		progressPercent?: number;
		status?: string;
	};
};

const normalizeRealtimePayload = (raw: ScheduleRealtimePayloadRaw): ScheduleRealtimePayload => {
	const data = raw.data ?? raw.Data ?? {};

	return {
		title: raw.title ?? raw.Title ?? "",
		message: raw.message ?? raw.Message ?? "",
		notificationType: raw.notificationType ?? raw.NotificationType ?? "",
		createdAt: raw.createdAt ?? raw.CreatedAt ?? "",
		data: {
			requestId: data.requestId,
			progressPercent: data.progressPercent,
			status: data.status,
		},
	};
};

export default function CreateSchedulePage() {
	const [doctors, setDoctors] = useState<AuthUserWithoutTokens[]>([]);
	const [roomQuantity, setRoomQuantity] = useState<number>(0);
	const [requestId, setRequestId] = useState<string | null>(null);
	const [isPollingProgress, setIsPollingProgress] = useState<boolean>(false);
	const [progressPercent, setProgressPercent] = useState<number>(0);
	const [progressMessage, setProgressMessage] = useState<string>("");
	const [previewSchedule, setPreviewSchedule] = useState<PreviewScheduleResult | null>(null);
	const terminalStatusRef = useRef<"completed" | "failed" | null>(null);
	const requestIdRef = useRef<string | null>(null);

	const { user } = useUserAuthContext();
	const hod = user as Employee;

	const stopPolling = useCallback(() => {
		setIsPollingProgress(false);
	}, []);

	const fetchScheduleResult = useCallback(async (currentRequestId: string) => {
		const scheduleResponse = await ScheduleService.getSchedule(currentRequestId);

		if (!("selected" in scheduleResponse)) {
			throw new Error(scheduleResponse.message || "Không thể lấy dữ liệu lịch trực");
		}

		setPreviewSchedule(scheduleResponse);
		window.localStorage.setItem(SCHEDULE_PREVIEW_CACHE_KEY, JSON.stringify(scheduleResponse));
	}, []);

	const startRealtimeTracking = useCallback((nextRequestId: string, initialMessage?: string) => {
		terminalStatusRef.current = null;
		requestIdRef.current = nextRequestId;
		setRequestId(nextRequestId);
		setIsPollingProgress(true);
		setProgressPercent(0);
		setProgressMessage(initialMessage || "Đã gửi yêu cầu, đang chờ cập nhật...");
	}, []);
	
	useEffect(() => {
		if (!hod?.departmentId) return;

		const fetchData = async () => {
			try {
				const [employeesData, roomData] = await Promise.all([
					EmployeeService.getAllEmployees("doctor", hod.departmentId),
					DepartmentService.getRoomsByDepartmentId(hod.departmentId),
				]);
				setDoctors(employeesData);
				setRoomQuantity(roomData.length);

			} catch (error) {
				void error;
				toast.error("Không thể tải dữ liệu");
			}
		};

		fetchData();
	}, [hod?.departmentId]);

	useEffect(() => {
		const cachedPreviewText = window.localStorage.getItem(SCHEDULE_PREVIEW_CACHE_KEY);
		if (cachedPreviewText) {
			try {
				const cachedPreview = JSON.parse(cachedPreviewText) as PreviewScheduleResult;
				if (cachedPreview.selected) {
					setPreviewSchedule(cachedPreview);
					setProgressPercent(100);
					setProgressMessage("Đã tải lịch đã tạo trước đó");
				}
			} catch (error) {
				void error;
				window.localStorage.removeItem(SCHEDULE_PREVIEW_CACHE_KEY);
			}
		}

		const storedRequestId = window.localStorage.getItem(SCHEDULE_REQUEST_ID_KEY);
		if (!storedRequestId) return;

		startRealtimeTracking(storedRequestId, "Đang cập nhật tiến độ...");
		void ScheduleService.getScheduleProgress(storedRequestId)
			.then((progress) => {
				const normalizedProgress = Math.min(Math.max(progress.progress_percent ?? 0, 0), 100);
				setProgressPercent(normalizedProgress);
				setProgressMessage(progress.message || "Đang xử lý xếp lịch...");

				if (String(progress.status).toLowerCase() === "completed") {
					void fetchScheduleResult(storedRequestId)
						.then(() => {
							setProgressPercent(100);
							setProgressMessage("Đã tải lịch đã tạo trước đó");
							stopPolling();
							requestIdRef.current = null;
							window.localStorage.removeItem(SCHEDULE_REQUEST_ID_KEY);
						})
						.catch(() => {
							setProgressMessage("Đã hoàn tất xử lý, đang chờ dữ liệu lịch sẵn sàng...");
						});
				}
				if (String(progress.status).toLowerCase() === "failed") {
					stopPolling();
					requestIdRef.current = null;
					window.localStorage.removeItem(SCHEDULE_REQUEST_ID_KEY);
				}
			})
			.catch(() => {
				// Không lấy được progress lúc khởi động, vẫn tiếp tục chờ event realtime.
			});
	}, [fetchScheduleResult, startRealtimeTracking, stopPolling]);

	useEffect(() => {
		if (!hod?.employeeId) return;

		onReceiveSchedulingUpdate((_, message) => {
				let payload: ScheduleRealtimePayload;
				try {
					const raw = JSON.parse(message) as ScheduleRealtimePayloadRaw;
					payload = normalizeRealtimePayload(raw);
				} catch {
					return;
				}

				const payloadRequestId = payload.data?.requestId ? String(payload.data.requestId) : null;
				const activeRequestId = requestIdRef.current;
				if (!payloadRequestId || !activeRequestId || payloadRequestId !== activeRequestId) {
					return;
				}

				const status = String(payload.data?.status || "").toLowerCase();
				const percent = Number(payload.data?.progressPercent ?? 0);

				setIsPollingProgress(true);
				setProgressPercent(Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 100) : 0);
				setProgressMessage(payload.message || "Đang xử lý xếp lịch...");

				if (status === "completed" && terminalStatusRef.current !== "completed") {
					terminalStatusRef.current = "completed";
					void fetchScheduleResult(activeRequestId)
						.then(() => {
							setProgressPercent(100);
							setProgressMessage("Đã tạo lịch xong");
							stopPolling();
							requestIdRef.current = null;
							window.localStorage.removeItem(SCHEDULE_REQUEST_ID_KEY);
							toast.success("Đã tạo lịch tự động thành công");
						})
						.catch(() => {
							terminalStatusRef.current = null;
							setProgressMessage("Đã hoàn tất xử lý, đang chờ dữ liệu lịch sẵn sàng...");
						});
				}

				if (status === "failed" && terminalStatusRef.current !== "failed") {
					terminalStatusRef.current = "failed";
					stopPolling();
					setRequestId(null);
					requestIdRef.current = null;
					window.localStorage.removeItem(SCHEDULE_REQUEST_ID_KEY);
					toast.error(payload.message || "Xếp lịch thất bại");
				}
			});

		void startSchedulingConnection(hod.employeeId).catch(() => {
			// Sẽ tự reconnect theo cấu hình SignalR.
		});

		return () => {
			offReceiveSchedulingUpdate();
		};
	}, [fetchScheduleResult, hod?.employeeId, stopPolling]);

	const method = useForm<SoftConstraintScheduleConfig>({
		defaultValues: {
			...SoftConstraintConfig.reduce((acc, constraint) => {
				acc[constraint.key] = constraint.defaultValue;
				return acc;
			}
			, {} as Record<string, string | number>)
		}
	});

	const onSubmit = async (data: SoftConstraintScheduleConfig) => {
		stopPolling();
		setPreviewSchedule(null);
		setProgressPercent(0);
		setProgressMessage("");
		setRequestId(null);
		requestIdRef.current = null;
		terminalStatusRef.current = null;
		window.localStorage.removeItem(SCHEDULE_PREVIEW_CACHE_KEY);
		window.localStorage.removeItem(SCHEDULE_REQUEST_ID_KEY);

		const doctorsData = doctors.map<DoctorRequest>(doc => {
			if (doc.employee) {
				const d = doc.employee;
				return {
					id: d.employeeId,
					name: `${d.firstName} ${d.lastName}`,
					experiences: d.experienceYears,
					department_id: String(d.departmentId),
					specialization: d.specialization,
					days_off: [],
					preferred_extra_days: [],
					has_valid_license: true,
					is_intern: false
				}
			}

			return {
				id: '',
				name: '',
				experiences: 0,
				department_id: '',
				specialization: '',
				days_off: [],
				preferred_extra_days: [],
				has_valid_license: true,
				is_intern: false
			};
		});

		const requestData: CreateScheduleRequest = {
			...data,
			rooms_per_shift: roomQuantity,
			doctors: doctorsData
		}

		const result = await ScheduleService.createScheduleAuto(requestData);
		if (result.status === "failed") {	
			toast.error(result.message);
			return;
		}

		window.localStorage.setItem(SCHEDULE_REQUEST_ID_KEY, result.data.request_id);
		startRealtimeTracking(result.data.request_id);
	}

	return (
		<>
			<FormProvider {...method}>
				<CreateSheduleHeader formId={SOFT_CONSTRAINT_FORM_ID} />
				<div className="flex flex-col lg:flex-row lg:h-[400px] gap-6 my-6">
					<form 
						id={SOFT_CONSTRAINT_FORM_ID}
						onSubmit={method.handleSubmit(onSubmit)}
						className={`${styles["schedule-container"]} ${styles["soft-constraint-form"]}`}
					>
						<SoftConstraintCard softConstraints={SoftConstraintConfig} />
					</form>
					<ApproveLeaveRequestCard />
				</div>
			</FormProvider>
			<PreviewScheduleCard
				doctors={doctors}
				scheduleResult={previewSchedule}
				isPollingProgress={isPollingProgress}
				progressPercent={progressPercent}
			/>
		</>
	);
}

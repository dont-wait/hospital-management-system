'use client';

import { CreateSheduleHeader } from '@/components/employee/doctor/hod/create-schedule/CreateSheduleHeader';
import { SoftConstraintCard } from '@/components/employee/doctor/hod/create-schedule/SoftConstraintCard';
import { ApproveLeaveRequestCard } from '@/components/employee/doctor/hod/create-schedule/ApproveLeaveRequest';
import { SoftConstraintConfig, SoftConstraintScheduleConfig } from '@/config';
import { PreviewScheduleCard } from '@/components/employee/doctor/hod/create-schedule/PreviewScheduleCard';
import { useForm, FormProvider } from 'react-hook-form';
import styles from "@/styles/create-schedule.module.css";
import { useEffect, useState } from 'react';
import { AuthUserWithoutTokens, Employee } from '@/types';
import { useUserAuthContext } from '@/contexts';
import { EmployeeService } from '@/services/employee.service';
import { toast } from 'react-toastify';
import { DepartmentService } from '@/services/department.service';

type DoctorRequest = {
	id: string;
	name: string;
	experiences: number;
	department_id: string;
	specialization: string;
	days_off: string[];
	preferred_extra_days: string[];	
	has_valid_license: true,
	is_intern: false
}

type CreateScheduleRequest = SoftConstraintScheduleConfig & {
	rooms_per_shift: number;
	doctors: DoctorRequest[];
}

const SOFT_CONSTRAINT_FORM_ID = 'soft-constraint-form';


export default function CreateSchedulePage() {
	const [doctors, setDoctors] = useState<AuthUserWithoutTokens[]>([]);
	const [roomQuantity, setRoomQuantity] = useState<number>(0);

	const { user } = useUserAuthContext();
	const hod = user as Employee;
	
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

	const method = useForm<SoftConstraintScheduleConfig>({
		defaultValues: {
			...SoftConstraintConfig.reduce((acc, constraint) => {
				acc[constraint.key] = constraint.defaultValue;
				return acc;
			}
			, {} as Record<string, string | number>)
		}
	});

	const onSubmit = (data: SoftConstraintScheduleConfig) => {
		const doctorsData = doctors.map<DoctorRequest>(doc => {
			if (doc.employee) {
				const d = doc.employee;
				return {
					id: d.employeeId,
					name: `${d.firstName} ${d.lastName}`,
					experiences: Date.now() - new Date(d.hireDate).getTime(),
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

		console.log("Soft Constraint Form Data:", requestData);
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
			<PreviewScheduleCard doctors={doctors} />
		</>
	);
}

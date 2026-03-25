'use client';

import { CreateSheduleHeader } from '@/components/employee/doctor/hod/create-schedule/CreateSheduleHeader';
import { SoftConstraintCard } from '@/components/employee/doctor/hod/create-schedule/SoftConstraintCard';
import { ApproveLeaveRequestCard } from '@/components/employee/doctor/hod/create-schedule/ApproveLeaveRequest';
import { SoftConstraintConfig, SoftConstraintScheduleConfig } from '@/config';
import { PreviewScheduleCard } from '@/components/employee/doctor/hod/create-schedule/PreviewScheduleCard';
import { useForm, FormProvider } from 'react-hook-form';
import styles from "@/styles/create-schedule.module.css";

export default function CreateSchedulePage() {
	const SOFT_CONSTRAINT_FORM_ID = 'soft-constraint-form';

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
		console.log("Soft Constraint Form Data:", data);
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
			<PreviewScheduleCard />
		</>
	);
}

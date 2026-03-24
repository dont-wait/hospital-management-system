'use client';

import React from 'react';
import { CreateSheduleHeader } from '@/components/employee/doctor/hod/create-schedule/CreateSheduleHeader';
import { SoftConstraintCard } from '@/components/employee/doctor/hod/create-schedule/SoftConstraintCard';
import { ApproveLeaveRequestCard } from '@/components/employee/doctor/hod/create-schedule/ApproveLeaveRequest';
import { SoftConstraintConfig } from '@/config';
import { PreviewScheduleCard } from '@/components/employee/doctor/hod/create-schedule/PreviewScheduleCard';

export default function CreateSchedulePage() {
	return (
		<>
			<CreateSheduleHeader />
			<div className="flex flex-col lg:flex-row gap-6 my-6">
				<SoftConstraintCard softConstraints={SoftConstraintConfig} />
				<ApproveLeaveRequestCard />
			</div>
			<PreviewScheduleCard />
		</>
	);
}

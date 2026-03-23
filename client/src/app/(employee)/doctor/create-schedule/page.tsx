'use client';

import React from 'react';
import { CreateSheduleHeader } from '@/components/employee/doctor/hod/create-schedule/CreateSheduleHeader';
import { SoftConstraintCard } from '@/components/employee/doctor/hod/create-schedule/SoftConstraintCard';
import { ApproveLeaveRequest } from '@/components/employee/doctor/hod/create-schedule/ApproveLeaveRequest';
import { SoftConstraintConfig } from '@/config';

export default function CreateSchedulePage() {
	return (
		<>
			<CreateSheduleHeader />
			<div className="flex flex-col lg:flex-row gap-6 mt-6">
				<SoftConstraintCard softConstraints={SoftConstraintConfig} />
				<ApproveLeaveRequest />
			</div>
		</>
	);
}

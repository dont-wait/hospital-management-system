import BookingContainer from "@/components/patient/booking/BookingContainer";
import AddMedicalRecord from "@/components/patient/booking/medical-record/AddMedicalRecord";
import AddBookingInfo from "@/components/patient/booking/AddBookingInfo";
import SelectPriority from "@/components/patient/booking/priority-option/SelectPriority";
import SelectDepartment from "@/components/patient/booking/department-option/SelectDepartment";
import SelectDoctor from "@/components/patient/booking/doctor-option/SelectDoctor";
import SelectDay from "@/components/patient/booking/day-option/SelectDay";
import ConfirmBooking from "@/components/patient/booking/confirm-booking/ConfirmBooking";
import BookingPayment from "@/components/patient/booking/payment/BookingPayment";
import CompletedBooking from "@/components/patient/booking/completed-booking/CompletedBooking";

type BookingPageProps = {
  searchParams?: Promise<{
    departmentId?: string;
    day?: string;
  }>;
};

export default async function BookingPage(props: BookingPageProps) {
  const searchParams = await props.searchParams;
  const departmentId = searchParams?.departmentId ?? "";
  const day = searchParams?.day ?? "";
  return (
    <BookingContainer>
      <AddMedicalRecord />
      <SelectPriority />
      <AddBookingInfo>
        <SelectDepartment day={day} departmentId={departmentId} />
        <SelectDoctor day={day} departmentId={departmentId} />
        <SelectDay />
      </AddBookingInfo>
      <ConfirmBooking />
      <BookingPayment />
      <CompletedBooking />
    </BookingContainer>
  );
}

import Link from "next/link";
import Icon from "@/components/shared/Icon";
import doctorStyles from "@/styles/doctor.module.css";

interface QueueTableBodyProps {
  patients: {
    id: number;
    stt: number;
    name: string;
    symptoms: string;
    appointmentType: string;
  }[];
}

export default function QueueTableBody({ patients }: QueueTableBodyProps) {
  const appointmentTypeClassMap = {
    BHYT: doctorStyles["type-insurance"],
    "DV Offline": doctorStyles["type-service-offline"],
    "DV Online": doctorStyles["type-service-online"],
  };

  return (
    <tbody>
      {patients.map((patient) => {
        const appointmentTypeClass =
          appointmentTypeClassMap[
            patient.appointmentType as keyof typeof appointmentTypeClassMap
          ] || doctorStyles["type-default"];

        return (
          <tr key={patient.id} className={doctorStyles["table-row"]}>
            <td className={doctorStyles["table-cell"]}>
              <span className={doctorStyles["stt-badge"]}>{patient.stt}</span>
            </td>
            <td
              className={`${doctorStyles["table-cell"]} ${doctorStyles["patient-name"]}`}
            >
              {patient.name}
            </td>
            <td
              className={`${doctorStyles["table-cell"]} ${doctorStyles["symptoms-text"]}`}
            >
              {patient.symptoms}
            </td>
            <td className={doctorStyles["table-cell"]}>
              <span
                className={`${doctorStyles["appointment-type-badge"]} ${appointmentTypeClass}`}
              >
                {patient.appointmentType}
              </span>
            </td>
            <td
              className={`${doctorStyles["table-cell"]} ${doctorStyles["text-center"]}`}
            >
              <Link
                className={doctorStyles["start-btn"]}
                href="/doctor/medical-visit"
              >
                <Icon name="Stethoscope" className="w-4" />
                <span>Bắt đầu khám</span>
              </Link>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

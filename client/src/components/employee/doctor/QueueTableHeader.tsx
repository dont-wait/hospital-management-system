import doctorStyles from "@/styles/doctor.module.css";

export default function QueueTableHeader() {
  return (
    <thead>
      <tr className={doctorStyles["table-header-row"]}>
        <th className={doctorStyles["table-header"]}>STT</th>
        <th className={doctorStyles["table-header"]}>Tên Bệnh Nhân</th>
        <th className={doctorStyles["table-header"]}>Triệu Chứng</th>
        <th className={doctorStyles["table-header"]}>Loại khám</th>
        <th
          className={`${doctorStyles["table-header"]} ${doctorStyles["text-center"]}`}
        >
          Thao Tác
        </th>
      </tr>
    </thead>
  );
}

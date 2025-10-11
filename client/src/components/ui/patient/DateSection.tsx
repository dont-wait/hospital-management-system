import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/shared/Label";
import { Input } from "@/components/ui/shared/Input";
import { PatientUpdateDto } from "@/schemas/patient";

const months = [
  { value: "01", label: "Tháng 1" },
  { value: "02", label: "Tháng 2" },
  { value: "03", label: "Tháng 3" },
  { value: "04", label: "Tháng 4" },
  { value: "05", label: "Tháng 5" },
  { value: "06", label: "Tháng 6" },
  { value: "07", label: "Tháng 7" },
  { value: "08", label: "Tháng 8" },
  { value: "09", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
];

type DateSectionProps = {
  setValue: UseFormSetValue<PatientUpdateDto>;
  errors: FieldErrors<PatientUpdateDto>;
  defaultValue?: string;
};

function DateSection({ setValue, errors, defaultValue }: DateSectionProps) {
  const [dateState, setDateState] = useState({
    day: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    if (defaultValue) {
      const date = new Date(defaultValue);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      setDateState({ day, month, year });
    }
  }, [defaultValue]);

  useEffect(() => {
    const { day, month, year } = dateState;
    if (day && month && year) {
      const dateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      setValue("dateOfBirth", dateString, { shouldValidate: false });
    }
  }, [dateState, setValue]);

  const handleDayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateState((prev) => ({ ...prev, day: e.target.value }));
    },
    [],
  );

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDateState((prev) => ({ ...prev, month: e.target.value }));
    },
    [],
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateState((prev) => ({ ...prev, year: e.target.value }));
    },
    [],
  );

  const monthOptions = useMemo(
    () => (
      <>
        <option value="">Tháng</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </>
    ),
    [],
  );

  return (
    <div className="space-y-2">
      <Label>Ngày sinh *</Label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div>
          <Input
            type="number"
            placeholder="Ngày"
            value={dateState.day}
            onChange={handleDayChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="31"
          />
        </div>
        <div>
          <select
            value={dateState.month}
            onChange={handleMonthChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {monthOptions}
          </select>
        </div>
        <div>
          <Input
            type="number"
            placeholder="Năm"
            value={dateState.year}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1900"
            max="2100"
          />
        </div>
      </div>
      {errors.dateOfBirth && (
        <p className="text-sm text-red-600">
          {errors.dateOfBirth.message as string}
        </p>
      )}
    </div>
  );
}

export default memo(DateSection);

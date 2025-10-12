import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/shared/Label";
import { Input } from "@/components/ui/shared/Input";
import { PatientUpdateDto } from "@/schemas/patient";
import { months } from "@/config/DateConfig";
import DateService from "@/services/date.service";

type DateSectionProps = {
  setValue: UseFormSetValue<PatientUpdateDto>;
  errors: FieldErrors<PatientUpdateDto>;
  defaultValue?: string;
};

function DateSection({ setValue, errors, defaultValue }: DateSectionProps) {
  const [dayError, setDayError] = useState<string | null>(null);
  const [dateState, setDateState] = useState(() => {
    if (defaultValue) {
      const date = new Date(defaultValue);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      return { day, month, year };
    } else {
      return {
        day: "",
        month: "",
        year: "",
      };
    }
  });

  useEffect(() => {
    const error = DateService.validateDay(
      dateState.day,
      dateState.month,
      dateState.year,
    );
    setDayError(error);
  }, [dateState.day, dateState.month, dateState.year]);

  useEffect(() => {
    const { day, month, year } = dateState;
    if (day && month && year && !dayError) {
      const dateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      setValue("dateOfBirth", dateString, { shouldValidate: false });
    } else {
      setValue("dateOfBirth", "");
    }
  }, [dateState, setValue, dayError]);

  const handleDayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDateState((prev) => ({ ...prev, day: value }));
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
      const value = e.target.value;
      if (value === "" || /^\d{1,4}$/.test(value)) {
        setDateState((prev) => ({ ...prev, year: value }));
      }
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
            placeholder="Ngày"
            value={dateState.day}
            onChange={handleDayChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              dayError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
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
      {dayError && <p className="text-sm text-red-600">{dayError}</p>}
      {errors.dateOfBirth && !dayError && (
        <p className="text-sm text-red-600">
          {errors.dateOfBirth.message as string}
        </p>
      )}
    </div>
  );
}

export default memo(DateSection);

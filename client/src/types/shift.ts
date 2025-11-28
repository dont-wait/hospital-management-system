export interface Room {
  id: number;
  name: string;
  capacity: number;
}

export interface SelectOption {
    value: string;
    label: string;
}

export const WORK_SHIFTS: readonly SelectOption[] = [
    { value: "0", label: "Ca sáng (7h - 12h)" },
    { value: "1", label: "Ca chiều (13h - 17h)" },
] as const;

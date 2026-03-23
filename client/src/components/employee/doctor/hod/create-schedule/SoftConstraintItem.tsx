'use client';

import { SoftConstraintField } from "@/config";
import styles from "@/styles/create-schedule.module.css";


export function SoftConstraintItem({ softConstraint }: { softConstraint: SoftConstraintField }) {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        <h3 className="font-medium text-lg">{softConstraint.title}</h3>
        <p className="font-light text-md text-gray-600">{softConstraint.description}</p>
      </div>
      <div>
        {
          softConstraint.inputType === "select" && (
            <select 
              className="w-32 md:w-40 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-east-bay"
              defaultValue={softConstraint.defaultValue}
            >
              {softConstraint.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )
        }
        <input 
          type={softConstraint.inputType}
          className="w-32 md:w-40 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-east-bay" 
          defaultValue={softConstraint.defaultValue}
        />
      </div>
    </div>
  );
}
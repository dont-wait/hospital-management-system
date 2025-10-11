"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/shared/Label";
import { CircleX } from "@/lib/client/utils";
import { Patient } from "@/types";

type PatientDetailProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  patient: Patient;
};

function PatientDetail({ patient, isOpen, setIsOpen }: PatientDetailProps) {
  const getGender = (c: string) => {
    switch (c) {
      case "M":
        return "Nam";
      case "F":
        return "Nữ";
      case "O":
        return "Khác";
    }
  };

  const getDOB = (dob: string) => {
    const [year, month, day] = dob.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-100 to-white p-6 relative">
                <h2 className="text-2xl font-bold">Thông tin bệnh nhân</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 rounded-full p-2 transition-colors"
                >
                  <CircleX size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center rounded border border-gray-300 px-4 py-2 gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-100 rounded-full mr-3"></span>
                    <Label className="text-light text-gray-600">
                      Tên bệnh nhân:{" "}
                      <span className="font-normal">
                        {patient.firstName} {patient.lastName}
                      </span>
                    </Label>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center rounded border border-gray-300 px-4 py-2 gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-100 rounded-full mr-3"></span>
                    <Label className="text-light text-gray-600">
                      Quốc tịch:{" "}
                      <span className="font-normal">{patient.nationality}</span>
                    </Label>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center rounded border border-gray-300 px-4 py-2 gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-100 rounded-full mr-3"></span>
                    <Label className="text-light text-gray-600 block">
                      Giới tính:{" "}
                      <span className="font-normal">
                        {getGender(patient.gender)}
                      </span>
                    </Label>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center rounded border border-gray-300 px-4 py-2 gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-100 rounded-full mr-3"></span>
                    <Label className="text-light text-gray-600 block">
                      Ngày sinh:{" "}
                      <span className="font-normal">
                        {getDOB(patient.dateOfBirth)}
                      </span>
                    </Label>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center rounded border border-gray-300 px-4 py-2 gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-100 rounded-full mr-3"></span>
                    <Label className="text-light text-gray-600 block">
                      Số điện thoại:{" "}
                      <span className="font-normal">{patient.phoneNumber}</span>
                    </Label>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center rounded border border-gray-300 px-4 py-2 gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-100 rounded-full mr-3"></span>
                    <Label className="text-light text-gray-600 block">
                      Nơi sinh:{" "}
                      <span className="font-normal">{patient.placeOfResidence}</span>
                    </Label>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center rounded border border-gray-300 px-4 py-2 gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-100 rounded-full mr-3"></span>
                    <Label className="text-light text-gray-600 block">
                      Địa chỉ:{" "}
                      <span className="font-normal">{patient.address}</span>
                    </Label>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PatientDetail;

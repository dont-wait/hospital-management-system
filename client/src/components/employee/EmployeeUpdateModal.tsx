import { Modal } from "../shared";
import { UpdateEmployeeForm } from "./UpdateEmployeeForm";
import { AuthUserWithoutTokens } from "@/types";

interface EmployeeUpdateModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    employee: AuthUserWithoutTokens;
    isAdmin?: boolean;
    onSuccess?: (updatedEmployee: AuthUserWithoutTokens) => void;
}

export function EmployeeUpdateModal({
    isOpen,
    setIsOpen,
    employee,
    isAdmin = false,
    onSuccess,
}: EmployeeUpdateModalProps) {
    const handleSuccess = (updatedEmployee: AuthUserWithoutTokens) => {
        if (onSuccess) {
            onSuccess(updatedEmployee);
        }
        setIsOpen(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                setIsOpen(false);
            }}
            title={isAdmin ? "Chỉnh sửa thông tin nhân viên" : "Cập nhật thông tin của bạn"}
            maxWidth="xl"
        >
            <UpdateEmployeeForm
                employee={employee}
                isAdmin={isAdmin}
                onSuccess={handleSuccess}
                onCancel={() => setIsOpen(false)}
            />
        </Modal>
    );
}
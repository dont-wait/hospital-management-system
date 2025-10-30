import { Sidebar } from "@/components";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Sidebar />
        </>
    )
}
import SidebarForAdmin from "@/components/shared/SidebarForAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main>{children}</main>
            <SidebarForAdmin />
        </>
    )
}
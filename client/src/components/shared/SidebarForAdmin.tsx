'use client';

import { useEffect } from "react";
import { Sidebar } from "@/components";
import { AdminSidebar } from "../admin/AdminSidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import Image from "next/image";
import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";

const adminProfile = (user: Employee) => (
    <div className="flex items-center gap-4">
        <Image 
            src={user?.avatarUrl ?? "/images/df-avatar.webp"}
            alt="Admin Avatar"
            width={40}
            height={40}
            className="rounded-full mb-2"
        />
        <div>
            <h3 className="text-lg font-semibold">{`${user?.firstName} ${user?.lastName}`}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
    </div>
);

function SidebarForAdmin() {
    const { setContent, setPosition, openSidebar, setShowCloseButton, setTitle } = useSidebar();
    const { user } = useUserAuthContext();
    
    useEffect(() => {
        setPosition("left");
        setShowCloseButton(false);
        setContent(<AdminSidebar />);
        setTitle(adminProfile(user as Employee));
        openSidebar();
    }, []);
    
    return (
        <Sidebar />
    );
}

export default SidebarForAdmin;
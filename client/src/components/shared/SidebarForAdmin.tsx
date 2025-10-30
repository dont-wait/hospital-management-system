'use client';

import { useEffect } from "react";
import { Sidebar } from "@/components";
import { AdminSidebar } from "../admin/AdminSidebar";
import { useSidebar } from "@/contexts/SidebarContext";

function SidebarForAdmin() {
    const { setContent, setPosition, openSidebar, setShowCloseButton } = useSidebar();
    
    useEffect(() => {
        setPosition("left");
        setShowCloseButton(false);
        setContent(<AdminSidebar />);
        openSidebar();
    }, []);
    
    return (
        <Sidebar />
    );
}

export default SidebarForAdmin;
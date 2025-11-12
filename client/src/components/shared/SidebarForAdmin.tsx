'use client';

import { useEffect, useState } from "react";
import { Sidebar } from "@/components";
import { AdminSidebar } from "../admin/AdminSidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import Image from "next/image";
import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import styles from "@/styles/admin-sidebar.css";

const adminProfile = (user: Employee) => (
    <div className={styles["admin-profile"]}>
        <Image 
            src={user?.avatarUrl ?? "/images/df-avatar.webp"}
            alt="Admin Avatar"
            width={50}
            height={50}
            className={styles["admin-avatar"]}
        />
        <div className={styles["admin-info"]}>
            <h3 className={styles["admin-name"]}>{`${user?.firstName} ${user?.lastName}`}</h3>
            <p className={styles["admin-email"]}>{user?.email}</p>
        </div>
    </div>
);

function SidebarForAdmin() {
    const { setContent, setPosition, openSidebar, setShowCloseButton, setTitle, setColorBackground, closeSidebar } = useSidebar();
    const { user } = useUserAuthContext();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleItemClick = () => {
            if (isMobile) {
                closeSidebar();
            }
        };

        setContent(<AdminSidebar onItemClick={handleItemClick} />);
        setPosition("left");
        setColorBackground("#2563EB");
        setTitle(adminProfile(user as Employee));
    }, [user, isMobile, closeSidebar, setContent, setPosition, setColorBackground, setTitle]);

    useEffect(() => {
        setShowCloseButton(isMobile);
        
        if (!isMobile) {
            openSidebar();
        } else {
            closeSidebar();
        }
    }, [isMobile, setShowCloseButton, openSidebar, closeSidebar]);
    
    return (
        <Sidebar />
    );
}

export default SidebarForAdmin;
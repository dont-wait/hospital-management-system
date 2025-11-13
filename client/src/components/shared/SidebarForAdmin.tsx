'use client';

import { useEffect } from "react";
import { Sidebar } from "@/components";
import { AdminSidebar } from "../admin/AdminSidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import Image from "next/image";
import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import styles from "@/styles/admin-sidebar.module.css";

const adminProfile = (user: Employee) => (
    <div className={styles["admin-profile"]}>
        <Image 
            src={user?.avatarUrl ?? "/images/df-avatar.webp"}
            alt="Admin Avatar"
            width={50}
            height={50}
            className={styles["admin-avatar"]}
        />
        <div>
            <h3 className={styles["admin-name"]}>{`${user?.firstName} ${user?.lastName}`}</h3>
            <p className={styles["admin-email"]}>{user?.email}</p>
        </div>
    </div>
);

function SidebarForAdmin() {
    const { setContent, setPosition, setShowCloseButton, setTitle, setColorBackground, closeSidebar } = useSidebar();
    const { user } = useUserAuthContext();

    useEffect(() => {
        setShowCloseButton(false);
        setContent(<AdminSidebar />);
        setPosition("left");
        setColorBackground("#2563EB");
        setTitle(adminProfile(user as Employee));
    }, [user, setShowCloseButton, closeSidebar, setContent, setPosition, setColorBackground, setTitle]);

    return (
        <Sidebar />
    );
}

export default SidebarForAdmin;

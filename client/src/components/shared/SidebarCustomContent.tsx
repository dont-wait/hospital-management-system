'use client';

import { useEffect, useMemo } from "react";
import { Sidebar } from "@/components";
import { useSidebar } from "@/contexts/SidebarContext";
import Image from "next/image";
import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import styles from "@/styles/custom-sidebar-content.module.css";

const SidebarProfileHeader = (user: Employee) => (
    <div className={styles["profile"]}>
        <Image 
            src={user?.avatarUrl ?? "/images/df-avatar.webp"}
            alt="Admin Avatar"
            width={50}
            height={50}
            className={styles["avatar"]}
        />
        <div>
            <h3 className={styles["name"]}>{`${user?.firstName} ${user?.lastName}`}</h3>
            <p className={styles["email"]}>{user?.email}</p>
        </div>
    </div>
);

function SidebarCustomContent({ content } : { content: React.ReactNode }) {
    const { setContent, setPosition, setShowCloseButton, setTitle, setColorBackground, setCloseButtonMode } = useSidebar();
    const { user } = useUserAuthContext();

    const title = useMemo(() => SidebarProfileHeader(user as Employee), [user]);

    useEffect(() => {
        setShowCloseButton(true);
        setCloseButtonMode("mobile-only");
        setContent(content);
        setPosition("left");
        setColorBackground("#2563EB");
        setTitle(title);
    }, [content, title, setShowCloseButton, setContent, setPosition, setColorBackground, setTitle, setCloseButtonMode]);

    return (
        <Sidebar />
    );
}

export default SidebarCustomContent;

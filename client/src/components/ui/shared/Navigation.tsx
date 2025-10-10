"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/shared/Button";
import PatientSidebar from "@/components/ui/sidebars/PatientSidebar";
import { Heart, Bell, Menu } from "@/lib/client/utils";

export function Navigation() {
  const { authUser, isAuthenticated } = useAuth();
  const { openSidebar, setContent } = useSidebar();

  const handleOpenDetails = () => {
    setContent(<PatientSidebar />);
    openSidebar();
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <section className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">MediCare</span>
            </Link>
          </section>

          {/* Options section */}
          <section className="flex items-center space-x-4">
            {isAuthenticated && (
              <Image
                src={authUser!.avatarUrl}
                className="rounded-full"
                width={32}
                height={32}
                alt="avatar"
              />
            )}

            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleOpenDetails}>
              <Menu className="h-4 w-4" />
            </Button>
          </section>
        </div>
      </div>
    </nav>
  );
}

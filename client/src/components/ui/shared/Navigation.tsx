"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/shared/Button";
import { Heart, User, LogOut, Home, UserCheck } from "lucide-react";

export function Navigation() {
  const { authUser, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">MediCare</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Trang chủ</span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                {authUser && authUser.employee && (
                  <Link href="/doctor">
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Bảng điều khiển Bác sĩ</span>
                    </Button>
                  </Link>
                )}

                {authUser && authUser.patient && (
                  <Link href="/patient">
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Cổng thông tin Bệnh nhân</span>
                    </Button>
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <Button onClick={logout} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button>Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

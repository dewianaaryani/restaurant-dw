"use client";
import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DynamicSidebar } from "@/app/components/dynamic-sidebar";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  const userRole = session?.user?.role || "staff";
  return (
    <SidebarProvider>
      <DynamicSidebar userRole={userRole} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

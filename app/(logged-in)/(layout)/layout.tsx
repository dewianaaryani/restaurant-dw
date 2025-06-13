import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DynamicSidebar } from "@/app/components/dynamic-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you'd get this from authentication context
  const userRole = "admin"; // This could be "admin", "staff", "kitchen", or "cashier"

  return (
    <SidebarProvider>
      <DynamicSidebar userRole={userRole} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

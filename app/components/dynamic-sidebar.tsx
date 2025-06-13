"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  ChefHat,
  LogOut,
  FolderOpen,
  CreditCard,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface NavigationItem {
  title: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  roles: string[];
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "staff", "kitchen", "cashier"],
  },
  {
    title: "Category Management",
    url: "/admin/categories",
    icon: FolderOpen,
    roles: ["admin", "staff"],
  },
  {
    title: "Menu Management",
    url: "/admin/menu",
    icon: UtensilsCrossed,
    roles: ["admin", "staff"],
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Order Management",
    url: "/admin/orders",
    icon: ShoppingCart,
    roles: ["admin", "staff", "cashier"],
    badge: "12",
  },
  {
    title: "Kitchen Orders",
    url: "/admin/kitchen",
    icon: ChefHat,
    roles: ["kitchen", "admin"],
    badge: "5",
  },
  {
    title: "Payment Processing",
    url: "/admin/payments",
    icon: CreditCard,
    roles: ["cashier", "admin"],
  },
  {
    title: "Reviews & Ratings",
    url: "/admin/reviews",
    icon: Star,
    roles: ["admin", "staff"],
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

interface DynamicSidebarProps {
  userRole: string;
}

export function DynamicSidebar({ userRole = "admin" }: DynamicSidebarProps) {
  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "kitchen":
        return "bg-green-100 text-green-800";
      case "cashier":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-600" />
            <span className="font-semibold text-lg">Dw Restaurant</span>
          </div>
          <Badge className={getRoleColor(userRole)}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-2" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <LogOut className="h-4 w-4" />
                <span>Back to Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

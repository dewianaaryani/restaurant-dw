"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Shield,
  Users,
  ChefHat,
  CreditCard,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

enum Role {
  admin = "admin",
  cashier = "cashier",
  kitchen = "kitchen",
  customer = "customer",
}

interface UserInterface {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
  lastLogin?: string;
}

interface ApiResponse {
  users: UserInterface[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const userTypes = [
  {
    value: Role.admin,
    label: "Admin",
    icon: Shield,
    color: "bg-red-100 text-red-800",
  },
  {
    value: Role.cashier,
    label: "Cashier",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: Role.kitchen,
    label: "Kitchen",
    icon: ChefHat,
    color: "bg-green-100 text-green-800",
  },
  {
    value: Role.customer,
    label: "Customer",
    icon: User,
    color: "bg-gray-100 text-gray-800",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Memoize fetchUsers to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole !== "all" && { role: selectedRole }),
      });

      const response = await fetch(`/api/users?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: ApiResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedRole]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getUserTypeInfo = (role: Role) => {
    return userTypes.find((t) => t.value === role) || userTypes[3];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleRoleChange = async (userId: number, newRole: Role) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      const updatedUser = await response.json();

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));

      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRoleFilter = (value: string) => {
    setSelectedRole(value);
    setPage(1);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Total users: {pagination.total}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {userTypes.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {users.map((user) => {
          const typeInfo = getUserTypeInfo(user.role);
          const TypeIcon = typeInfo.icon;

          return (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/placeholder.svg?height=48&width=48`}
                      />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <Badge className={typeInfo.color}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {typeInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-2">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={user.role}
                        onValueChange={(value: Role) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Change Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {userTypes.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center">
                                <role.icon className="h-4 w-4 mr-2" />
                                {role.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === Role.customer).length}
            </div>
            <p className="text-xs text-muted-foreground">Customer accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kitchen Staff</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === Role.kitchen).length}
            </div>
            <p className="text-xs text-muted-foreground">Kitchen accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cashiers</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === Role.cashier).length}
            </div>
            <p className="text-xs text-muted-foreground">Cashier accounts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

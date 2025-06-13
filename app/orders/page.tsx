"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MainNav } from "../components/main-nav";
import { useSession } from "next-auth/react";

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-06-10T18:30:00Z",
    status: "completed",
    total: 65.0,
    items: [
      { name: "Grilled Salmon", quantity: 1, price: 28.0 },
      { name: "House Wine", quantity: 2, price: 15.0 },
      { name: "Chocolate Cake", quantity: 1, price: 7.0 },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-06-12T19:15:00Z",
    status: "in-progress",
    total: 78.5,
    items: [
      { name: "Beef Wellington", quantity: 1, price: 45.0 },
      { name: "Caesar Salad", quantity: 1, price: 16.0 },
      { name: "Red Wine", quantity: 1, price: 17.5 },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-06-13T20:45:00Z",
    status: "cancelled",
    total: 38.0,
    items: [
      { name: "Truffle Risotto", quantity: 1, price: 32.0 },
      { name: "Garlic Bread", quantity: 1, price: 6.0 },
    ],
  },
];

export default function OrdersPage() {
  const router = useRouter();
  ///old way///
  //const { user, isLoadingAuth } = useAuth();

  // BERDASARKAN NEXTAUTH
  const { data: session, status } = useSession();
  const isLoadingAuth = status === "loading";
  const user = session?.user || {
    name: "Guest",
    email: "guest@example.com",
    image: "/placeholder.svg",
    role: "guest",
    id: "guest",
  };
  // Redirect if not logged in
  if (!isLoadingAuth && !user) {
    router.push("/login");
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4 mt-4">
                {mockOrders.length > 0 ? (
                  mockOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <EmptyOrdersState />
                )}
              </div>
            </TabsContent>

            <TabsContent value="in-progress">
              <div className="space-y-4 mt-4">
                {mockOrders.filter((order) => order.status === "in-progress")
                  .length > 0 ? (
                  mockOrders
                    .filter((order) => order.status === "in-progress")
                    .map((order) => <OrderCard key={order.id} order={order} />)
                ) : (
                  <EmptyOrdersState message="You don't have any orders in progress." />
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4 mt-4">
                {mockOrders.filter((order) => order.status === "completed")
                  .length > 0 ? (
                  mockOrders
                    .filter((order) => order.status === "completed")
                    .map((order) => <OrderCard key={order.id} order={order} />)
                ) : (
                  <EmptyOrdersState message="You don't have any completed orders yet." />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: {
    id: string;
    date: string;
    status: string;
    total: number;
    items: { name: string; quantity: number; price: number }[];
  };
}

function OrderCard({ order }: OrderCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.id}</CardTitle>
            <CardDescription>
              {new Date(order.date).toLocaleDateString()} at{" "}
              {new Date(order.date).toLocaleTimeString()}
            </CardDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-sm text-muted-foreground">
                +{order.items.length - 2} more items
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <div className="font-medium">Total: ${order.total.toFixed(2)}</div>
            <Link href={`/orders/${order.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-800"
              >
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyOrdersState({ message = "You haven't placed any orders yet." }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-orange-100 p-3 mb-4">
        <Clock className="h-6 w-6 text-orange-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button
        onClick={() => router.push("/menu")}
        className="bg-orange-600 hover:bg-orange-700"
      >
        Browse Menu
      </Button>
    </div>
  );
}

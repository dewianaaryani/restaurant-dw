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
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/types";
import { formatRupiah } from "@/utils/formatter";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/users/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (isLoading) {
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cooking">Cooking</TabsTrigger>
              <TabsTrigger value="Ready">Ready</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4 mt-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <EmptyOrdersState />
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4 mt-4">
                {orders.filter((order) => order.order_status === "pending")
                  .length > 0 ? (
                  orders
                    .filter((order) => order.order_status === "pending")
                    .map((order) => <OrderCard key={order.id} order={order} />)
                ) : (
                  <EmptyOrdersState message="You don't have any orders in progress." />
                )}
              </div>
            </TabsContent>
            <TabsContent value="cooking">
              <div className="space-y-4 mt-4">
                {orders.filter((order) => order.order_status === "cooking")
                  .length > 0 ? (
                  orders
                    .filter((order) => order.order_status === "cooking")
                    .map((order) => <OrderCard key={order.id} order={order} />)
                ) : (
                  <EmptyOrdersState message="You don't have any orders in progress." />
                )}
              </div>
            </TabsContent>
            <TabsContent value="Ready">
              <div className="space-y-4 mt-4">
                {orders.filter((order) => order.order_status === "ready")
                  .length > 0 ? (
                  orders
                    .filter((order) => order.order_status === "ready")
                    .map((order) => <OrderCard key={order.id} order={order} />)
                ) : (
                  <EmptyOrdersState message="You don't have any orders in progress." />
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4 mt-4">
                {orders.filter((order) => order.order_status === "completed")
                  .length > 0 ? (
                  orders
                    .filter((order) => order.order_status === "completed")
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
  order: Order;
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
              {new Date(order.created_at).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </CardDescription>
          </div>
          {getStatusBadge(order.order_status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {order.order_items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.quantity}x {item.menu.name}
                </span>
                <span>{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
            {order.order_items.length > 2 && (
              <div className="text-sm text-muted-foreground">
                +{order.order_items.length - 2} more items
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <div className="font-medium">
              Total: {formatRupiah(order.total_amount)}
            </div>
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

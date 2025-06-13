"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  DollarSign,
} from "lucide-react";

interface OrderItem {
  id: number;
  order_id: string;
  menu_id: string;
  menu_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  customization?: string;
}

interface Order {
  id: number;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  table_number: number;
  order_status: string;
  payment_status: string;
  total_amount: number;
  order_time: string;
  completed_time?: string;
  kasir_id?: string;
  items: OrderItem[];
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customer_id: "1",
      customer_name: "John Doe",
      customer_email: "john@example.com",
      table_number: 5,
      order_status: "completed",
      payment_status: "paid",
      total_amount: 65.0,
      order_time: "2024-01-15T19:30:00Z",
      completed_time: "2024-01-15T20:15:00Z",
      kasir_id: "4",
      items: [
        {
          id: 1,
          order_id: "1",
          menu_id: "1",
          menu_name: "Grilled Salmon",
          price: 28.0,
          quantity: 1,
          subtotal: 28.0,
        },
        {
          id: 2,
          order_id: "1",
          menu_id: "4",
          menu_name: "House Wine",
          price: 15.0,
          quantity: 2,
          subtotal: 30.0,
        },
        {
          id: 3,
          order_id: "1",
          menu_id: "8",
          menu_name: "Chocolate Cake",
          price: 7.0,
          quantity: 1,
          subtotal: 7.0,
        },
      ],
    },
    {
      id: 2,
      customer_id: "2",
      customer_name: "Jane Smith",
      customer_email: "jane@example.com",
      table_number: 2,
      order_status: "preparing",
      payment_status: "pending",
      total_amount: 78.5,
      order_time: "2024-01-15T20:15:00Z",
      items: [
        {
          id: 4,
          order_id: "2",
          menu_id: "2",
          menu_name: "Beef Wellington",
          price: 45.0,
          quantity: 1,
          subtotal: 45.0,
        },
        {
          id: 5,
          order_id: "2",
          menu_id: "5",
          menu_name: "Caesar Salad",
          price: 16.0,
          quantity: 1,
          subtotal: 16.0,
        },
        {
          id: 6,
          order_id: "2",
          menu_id: "6",
          menu_name: "Red Wine",
          price: 17.5,
          quantity: 1,
          subtotal: 17.5,
        },
      ],
    },
    {
      id: 3,
      customer_id: "3",
      customer_name: "Mike Johnson",
      customer_email: "mike@example.com",
      table_number: 8,
      order_status: "pending",
      payment_status: "pending",
      total_amount: 38.0,
      order_time: "2024-01-15T20:45:00Z",
      items: [
        {
          id: 7,
          order_id: "3",
          menu_id: "3",
          menu_name: "Truffle Risotto",
          price: 32.0,
          quantity: 1,
          subtotal: 32.0,
          customization: "Extra truffle",
        },
        {
          id: 8,
          order_id: "3",
          menu_id: "7",
          menu_name: "Garlic Bread",
          price: 6.0,
          quantity: 1,
          subtotal: 6.0,
        },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "preparing":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Preparing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "ready":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              order_status: newStatus,
              completed_time:
                newStatus === "completed"
                  ? new Date().toISOString()
                  : order.completed_time,
            }
          : order
      )
    );
  };

  const updatePaymentStatus = (orderId: number, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, payment_status: newStatus } : order
      )
    );
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const getStatusActions = (order: Order) => {
    switch (order.order_status) {
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order.id, "preparing")}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateOrderStatus(order.id, "cancelled")}
            >
              Decline
            </Button>
          </div>
        );
      case "preparing":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "ready")}
          >
            Mark Ready
          </Button>
        );
      case "ready":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "completed")}
          >
            Mark Served
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">
            Order Management
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer..."
                className="pl-8"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Today</Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">
                          #ORD-{order.id.toString().padStart(3, "0")}
                        </h3>
                        {getStatusBadge(order.order_status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.customer_name} • {order.customer_email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Table {order.table_number} •{" "}
                        {new Date(order.order_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        ${order.total_amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Order Items:</p>
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.menu_name}
                            {item.customization && (
                              <span className="text-muted-foreground">
                                {" "}
                                ({item.customization})
                              </span>
                            )}
                          </span>
                          <span>${item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewOrderDetails(order)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <div className="flex space-x-2">
                      {order.payment_status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePaymentStatus(order.id, "paid")}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Mark Paid
                        </Button>
                      )}
                      {getStatusActions(order)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Order Details - #ORD-
              {selectedOrder?.id.toString().padStart(3, "0")}
            </DialogTitle>
            <DialogDescription>
              Complete order information and items
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p className="text-sm">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer_email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Table {selectedOrder.table_number}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <p className="text-sm">
                    Order Time:{" "}
                    {new Date(selectedOrder.order_time).toLocaleString()}
                  </p>
                  {selectedOrder.completed_time && (
                    <p className="text-sm">
                      Completed:{" "}
                      {new Date(selectedOrder.completed_time).toLocaleString()}
                    </p>
                  )}
                  <div className="flex space-x-2 mt-2">
                    {getStatusBadge(selectedOrder.order_status)}
                    {getPaymentStatusBadge(selectedOrder.payment_status)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{item.menu_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                        {item.customization && (
                          <p className="text-sm text-blue-600">
                            Note: {item.customization}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-orange-600">
                    ${selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {
                orders.filter((order) => order.order_status === "pending")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                orders.filter((order) => order.order_status === "preparing")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">In kitchen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                orders.filter((order) => order.order_status === "completed")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {orders
                .reduce((sum, order) => sum + order.total_amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

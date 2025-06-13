"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { MainNav } from "@/app/components/main-nav";
import { StarRating } from "@/app/components/star-rating";
// Mock order data - in a real app, this would come from an API
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-06-10T18:30:00Z",
    status: "completed",
    total: 65.0,
    items: [
      {
        id: 1,
        name: "Grilled Salmon",
        quantity: 1,
        price: 28.0,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
      {
        id: 2,
        name: "House Wine",
        quantity: 2,
        price: 15.0,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
      {
        id: 3,
        name: "Chocolate Cake",
        quantity: 1,
        price: 7.0,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
    ],
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    paymentMethod: "Credit Card (****4567)",
    specialInstructions: "Please include extra napkins and utensils.",
  },
  {
    id: "ORD-002",
    date: "2024-06-12T19:15:00Z",
    status: "in-progress",
    total: 78.5,
    items: [
      {
        id: 4,
        name: "Beef Wellington",
        quantity: 1,
        price: 45.0,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
      {
        id: 5,
        name: "Caesar Salad",
        quantity: 1,
        price: 16.0,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
      {
        id: 6,
        name: "Red Wine",
        quantity: 1,
        price: 17.5,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
    ],
    deliveryAddress: "456 Park Ave, New York, NY 10022",
    paymentMethod: "PayPal",
    specialInstructions: "",
  },
  {
    id: "ORD-003",
    date: "2024-06-13T20:45:00Z",
    status: "cancelled",
    total: 38.0,
    items: [
      {
        id: 7,
        name: "Truffle Risotto",
        quantity: 1,
        price: 32.0,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
      {
        id: 8,
        name: "Garlic Bread",
        quantity: 1,
        price: 6.0,
        image: "/placeholder.svg?height=100&width=150",
        rating: 0,
      },
    ],
    deliveryAddress: "789 Broadway, New York, NY 10003",
    paymentMethod: "Cash on Delivery",
    specialInstructions: "Ring doorbell twice.",
  },
];

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch order data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchOrder = () => {
      setLoading(true);
      const foundOrder = mockOrders.find((o) => o.id === params.id);

      if (foundOrder) {
        setOrder(foundOrder);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [params.id]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const handleRateItem = (itemId: number, rating: number) => {
    // In a real app, this would be an API call to save the rating
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map((item) =>
        item.id === itemId ? { ...item, rating } : item
      ),
    }));

    toast("Rating submitted");
  };

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

  if (isLoading || loading) {
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <Link
                href="/orders"
                className="flex items-center text-orange-600 hover:text-orange-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-6">
                  The order you're looking for doesn't exist or you don't have
                  permission to view it.
                </p>
                <Button
                  onClick={() => router.push("/orders")}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  View All Orders
                </Button>
              </CardContent>
            </Card>
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
          <div className="flex items-center mb-6">
            <Link
              href="/orders"
              className="flex items-center text-orange-600 hover:text-orange-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl">Order {order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(order.date).toLocaleDateString()} at{" "}
                    {new Date(order.date).toLocaleTimeString()}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Order Items */}
                <div>
                  <h3 className="font-medium mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className="text-right mt-2 md:mt-0">
                              <p className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Rating section - only show for completed orders */}
                          {order.status === "completed" && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <p className="text-sm font-medium mb-1 md:mb-0">
                                  Rate this item:
                                </p>
                                <StarRating
                                  initialRating={item.rating}
                                  onRatingChange={(rating) =>
                                    handleRateItem(item.id, rating)
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div>
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery Fee
                      </span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(order.total * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        ${(order.total + order.total * 0.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Delivery Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {order.specialInstructions && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Special Instructions</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.specialInstructions}
                      </p>
                    </div>
                  </>
                )}

                {/* Order Actions */}
                {order.status === "in-progress" && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cancel Order
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

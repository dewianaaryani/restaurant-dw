"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X, Plus, Minus, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { CartItem, useCart } from "@/context/cart-context";
import { formatRupiah } from "@/utils/formatter";
import { toast } from "sonner";
import Link from "next/link";

export function ShoppingCartButton() {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center bg-orange-600">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <ShoppingCartPanel />
    </Sheet>
  );
}

function ShoppingCartPanel() {
  const { items, clearCart, subtotal, setIsCartOpen } = useCart();
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({
    tableNumber: "",
  });

  const handleCheckout = async () => {
    if (!checkoutInfo.tableNumber) {
      toast.error("Please enter a table number");
      return;
    }

    const tableNum = parseInt(checkoutInfo.tableNumber);
    if (isNaN(tableNum) || tableNum <= 0) {
      toast.error("Invalid table number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNumber: tableNum,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customization: item.customization,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }
      console.log(data);

      // Success
      toast.success("Order placed successfully, Check your oder");

      // Clear cart and close dialogs
      clearCart();
      setIsCheckoutDialogOpen(false);
      setIsCartOpen(false);

      // Reset checkout info
      setCheckoutInfo({
        tableNumber: "",
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SheetContent className="w-full sm:max-w-md flex flex-col">
      <SheetHeader>
        <SheetTitle>Your Order</SheetTitle>
      </SheetHeader>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Your cart is empty</h3>
          <p className="text-muted-foreground mt-2">
            Add some delicious items from our menu to get started.
          </p>
          <SheetClose asChild>
            <Button className="mt-6" asChild>
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </SheetClose>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="border-t py-4 px-4">
            <div className="flex justify-between font-medium mb-6">
              <span>Total</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => setIsCheckoutDialogOpen(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
                disabled={isLoading}
              >
                Clear Cart
              </Button>
            </div>
          </div>

          <Dialog
            open={isCheckoutDialogOpen}
            onOpenChange={setIsCheckoutDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Complete Your Order</DialogTitle>
                <DialogDescription>
                  Please provide your table information to complete the order.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    Table #*
                  </Label>
                  <Input
                    id="table"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={checkoutInfo.tableNumber}
                    onChange={(e) =>
                      setCheckoutInfo({
                        ...checkoutInfo,
                        tableNumber: e.target.value,
                      })
                    }
                    className="col-span-3"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCheckoutDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleCheckout}
                  disabled={isLoading || !checkoutInfo.tableNumber}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order (${formatRupiah(subtotal)})`
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </SheetContent>
  );
}

function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 p-2 px-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm truncate">{item.name}</h4>
          <button
            onClick={() => removeItem(item.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {formatRupiah(item.price)}
        </p>

        {item.customization && (
          <p className="text-xs text-muted-foreground italic truncate">
            Note: {item.customization}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 hover:bg-muted"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 hover:bg-muted"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="font-medium">
            {formatRupiah(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

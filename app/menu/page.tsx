"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { MainNav } from "../components/main-nav";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  category_id: string;
  categoryName: string;
  name: string;
  desc: string | null;
  price: number;
  image: string | null;
  is_available: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface MenuCategory {
  id: string;
  name: string;
  desc: string | null;
  menuCount: number;
  created_at: string;
  updated_at: string;
}

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch menu items
        const menuResponse = await fetch("/api/menu?available=true");
        if (!menuResponse.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const menuData = await menuResponse.json();
        setMenuItems(menuData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load menu data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter menu items based on search query and selected category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.desc &&
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory && item.is_available;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully crafted dishes made with the finest
            ingredients by our award-winning chefs.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs
          defaultValue="all"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="flex flex-wrap justify-center mb-4">
            <TabsTrigger value="all">All Items</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name} ({category.menuCount})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems
                  .filter((item) => item.category_id === category.id)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* No results message */}
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? `No menu items found matching "${searchQuery}"`
                : "No menu items available in this category"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");

  const handleAddToCart = () => {
    addItem({
      id: parseInt(item.id), // Convert string ID to number for cart
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image || "/placeholder.svg",
      customization: customization,
      categoryId: item.category_id,
      categoryName: item.categoryName,
    });

    toast.success(`${item.name} added to cart!`);
    setIsDialogOpen(false);
    setQuantity(1);
    setCustomization("");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-4 right-4 bg-white text-gray-900">
          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
          {item.rating.toFixed(1)}
        </Badge>
        {!item.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white">
              Currently Unavailable
            </Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <span className="text-xl font-bold text-orange-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <CardDescription>
          {item.desc || "Delicious dish prepared with care"}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={!item.is_available}
            >
              {item.is_available ? "Order Now" : "Unavailable"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="relative h-40 w-full">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {item.desc || "Delicious dish prepared with care"}
              </p>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <div className="flex items-center col-span-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 1)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customization" className="text-right">
                  Special Instructions
                </Label>
                <Textarea
                  id="customization"
                  placeholder="Any special requests?"
                  className="col-span-3"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Total: ${(item.price * quantity).toFixed(2)}
              </span>
              <Button
                onClick={handleAddToCart}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Add to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

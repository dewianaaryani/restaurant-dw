"use client";

import { useState } from "react";
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
import { Star, Search } from "lucide-react";
import Image from "next/image";
import { MainNav } from "../components/main-nav";
import { useCart } from "@/context/cart-context";

// Sample data for categories and menu items
const categories = [
  {
    id: "1",
    name: "Appetizers",
    desc: "Start your meal with our delicious appetizers",
  },
  { id: "2", name: "Main Course", desc: "Our signature main dishes" },
  { id: "3", name: "Desserts", desc: "Sweet endings to your meal" },
  { id: "4", name: "Beverages", desc: "Refreshing drinks and cocktails" },
];

const menuItems = [
  {
    id: 1,
    category_id: "1",
    name: "Bruschetta",
    desc: "Toasted bread topped with tomatoes, garlic, and fresh basil",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 12.0,
    rating: 4.6,
  },
  {
    id: 2,
    category_id: "1",
    name: "Calamari",
    desc: "Crispy fried squid served with marinara sauce",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 14.0,
    rating: 4.5,
  },
  {
    id: 3,
    category_id: "2",
    name: "Grilled Salmon",
    desc: "Fresh Atlantic salmon with herbs and lemon",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 28.0,
    rating: 4.8,
  },
  {
    id: 4,
    category_id: "2",
    name: "Beef Wellington",
    desc: "Classic beef wellington with mushroom duxelles",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 45.0,
    rating: 4.9,
  },
  {
    id: 5,
    category_id: "2",
    name: "Truffle Risotto",
    desc: "Creamy arborio rice with black truffle",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 32.0,
    rating: 4.7,
  },
  {
    id: 6,
    category_id: "3",
    name: "Tiramisu",
    desc: "Classic Italian dessert with coffee-soaked ladyfingers",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 9.0,
    rating: 4.8,
  },
  {
    id: 7,
    category_id: "3",
    name: "Chocolate Lava Cake",
    desc: "Warm chocolate cake with a molten center",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 11.0,
    rating: 4.9,
  },
  {
    id: 8,
    category_id: "4",
    name: "Signature Cocktail",
    desc: "Our house special with premium spirits",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 14.0,
    rating: 4.7,
  },
  {
    id: 9,
    category_id: "4",
    name: "Italian Wine",
    desc: "Premium selection from Italian vineyards",
    image: "/placeholder.svg?height=200&width=300",
    is_available: true,
    price: 18.0,
    rating: 4.8,
  },
];

interface MenuItem {
  id: number;
  category_id: string;
  name: string;
  desc: string;
  image: string;
  is_available: boolean;
  price: number;
  rating: number;
}

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter menu items based on search query and selected category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory && item.is_available;
  });

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
                {category.name}
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
    const categoryName =
      categories.find((cat) => cat.id === item.category_id)?.name || "Unknown";

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image,
      customization: customization,
      categoryId: item.category_id,
      categoryName: categoryName,
    });

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
          {item.rating}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <span className="text-xl font-bold text-orange-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <CardDescription>{item.desc}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Order Now
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
              <p className="text-sm text-muted-foreground">{item.desc}</p>
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

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Eye, Star, Upload } from "lucide-react";
import Image from "next/image";

interface MenuItem {
  id: number;
  category_id: string;
  name: string;
  desc: string;
  image: string;
  is_available: boolean;
  price: number;
  rating: number;
  orders: number;
  created_at: string;
  updated_at: string;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      category_id: "1",
      name: "Grilled Salmon",
      desc: "Fresh Atlantic salmon with herbs and lemon",
      image: "/placeholder.svg?height=100&width=150",
      is_available: true,
      price: 28.0,
      rating: 4.8,
      orders: 45,
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
    {
      id: 2,
      category_id: "2",
      name: "Beef Wellington",
      desc: "Classic beef wellington with mushroom duxelles",
      image: "/placeholder.svg?height=100&width=150",
      is_available: true,
      price: 45.0,
      rating: 4.9,
      orders: 32,
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
    {
      id: 3,
      category_id: "2",
      name: "Truffle Risotto",
      desc: "Creamy arborio rice with black truffle",
      image: "/placeholder.svg?height=100&width=150",
      is_available: true,
      price: 32.0,
      rating: 4.7,
      orders: 28,
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
    {
      id: 4,
      category_id: "1",
      name: "Caesar Salad",
      desc: "Classic caesar salad with parmesan and croutons",
      image: "/placeholder.svg?height=100&width=150",
      is_available: false,
      price: 16.0,
      rating: 4.5,
      orders: 15,
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
  ]);

  const categories = [
    { id: "1", name: "Appetizers" },
    { id: "2", name: "Main Course" },
    { id: "3", name: "Desserts" },
    { id: "4", name: "Beverages" },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    desc: "",
    image: "",
    is_available: true,
    price: 0,
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      category_id: "",
      name: "",
      desc: "",
      image: "",
      is_available: true,
      price: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id,
      name: item.name,
      desc: item.desc,
      image: item.image,
      is_available: item.is_available,
      price: item.price,
    });
    setIsDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData, updated_at: new Date().toISOString() }
            : item
        )
      );
    } else {
      const newItem: MenuItem = {
        id: Math.max(...menuItems.map((i) => i.id)) + 1,
        ...formData,
        rating: 0,
        orders: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setMenuItems([...menuItems, newItem]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id
          ? {
              ...item,
              is_available: !item.is_available,
              updated_at: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown";
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the menu item information below."
                  : "Create a new menu item for your restaurant."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="desc"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <div className="col-span-3 flex space-x-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Enter image URL"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="available" className="text-right">
                  Available
                </Label>
                <Switch
                  id="available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_available: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveItem}>
                {editingItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search menu items..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">Available Only</Button>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-32 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">
                          {getCategoryName(item.category_id)}
                        </Badge>
                        <Badge
                          className={
                            item.is_available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {item.rating}
                      </div>
                      <span>{item.orders} orders this month</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={item.is_available}
                        onCheckedChange={() => toggleAvailability(item.id)}
                      />
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">Menu items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter((item) => item.is_available).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (menuItems.filter((item) => item.is_available).length /
                  menuItems.length) *
                  100
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                menuItems.reduce((sum, item) => sum + item.rating, 0) /
                menuItems.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Overall rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {(
                menuItems.reduce((sum, item) => sum + item.price, 0) /
                menuItems.length
              ).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Average price</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

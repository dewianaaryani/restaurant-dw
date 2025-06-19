"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Search, Edit, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiError, Category } from "@/types";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  desc: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
      }

      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch categories";
      console.error("Error fetching categories:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.reset({ name: "", desc: "" });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      desc: category.desc || "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    setFormLoading(true);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          desc: data.desc?.trim() || undefined,
        }),
      });

      const responseData: Category | ApiError = await response.json();

      if (!response.ok) {
        const errorData = responseData as ApiError;
        throw new Error(errorData.error || "Operation failed");
      }

      const categoryData = responseData as Category;

      if (editingCategory) {
        // Update existing category
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? categoryData : cat
          )
        );
        toast.success("Category updated successfully");
      } else {
        // Add new category
        setCategories([categoryData, ...categories]);
        toast.success("Category created successfully");
      }

      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save category";
      console.error("Error saving category:", error);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      const data: { message: string } | ApiError = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.error || "Failed to delete category");
      }

      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      toast.success("Category deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete category";
      console.error("Error deleting category:", error);
      toast.error(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setEditingCategory(null);
    }
  };

  if (loading) {
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
          <h2 className="text-3xl font-bold tracking-tight">
            Category Management
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category information below."
                  : "Create a new category for your menu items."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter category description (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingCategory ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </div>
              <Badge variant="secondary">{category.menuCount ?? 0} items</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {category.desc || "No description available"}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Created:{" "}
                  {format(new Date(category.created_at), "d MMMM yyyy", {
                    locale: id,
                  })}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No categories found matching your search."
                : "No categories found. Create your first category!"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + (cat.menuCount ?? 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Largest Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0
                ? Math.max(...categories.map((cat) => cat.menuCount ?? 0))
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Items in largest category
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0
                ? Math.round(
                    categories.reduce(
                      (sum, cat) => sum + (cat.menuCount ?? 0),
                      0
                    ) / categories.length
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per category</p>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &ldquo;
              {categoryToDelete?.name}&rdquo;.
              {categoryToDelete && (categoryToDelete.menuCount ?? 0) > 0 && (
                <span className="text-red-600 block mt-2 font-medium">
                  ⚠️ This category has {categoryToDelete.menuCount ?? 0} menu
                  items. Please remove them first before deleting the category.
                </span>
              )}
              {categoryToDelete && (categoryToDelete.menuCount ?? 0) === 0 && (
                <span className="block mt-2">
                  This action cannot be undone.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={
                categoryToDelete ? (categoryToDelete.menuCount ?? 0) > 0 : false
              }
            >
              {categoryToDelete && (categoryToDelete.menuCount ?? 0) > 0
                ? "Cannot Delete"
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

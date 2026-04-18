"use client";

import { PencilLine, Plus, Power, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createCategory, deleteCategory, getAllCategories, toggleCategory, updateCategory } from "@/lib/api/categories";
import { getApiErrorMessage } from "@/lib/response-utils";
import { categorySchema, type CategoryFormValues } from "@/lib/schemas";
import type { Category } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const defaultValues: CategoryFormValues = {
  name: "",
  description: ""
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setCategories(await getAllCategories());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load categories."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      setSaving(true);

      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        toast.success("Category updated.");
      } else {
        await createCategory(values);
        toast.success("Category created.");
      }

      setModalOpen(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save category."));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (category: Category) => {
    try {
      await toggleCategory(category.id);
      toast.success("Category status updated.");
      await loadCategories();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to toggle category."));
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete ${category.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCategory(category.id);
      toast.success("Category deleted.");
      await loadCategories();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete category."));
    }
  };

  const sortedCategories = useMemo(
    () =>
      [...categories].sort(
        (left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
      ),
    [categories]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Taxonomy"
        title="Categories"
        description="Manage category name, description, and status."
        actions={
          <>
            <Button variant="outline" onClick={() => void loadCategories()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New category
            </Button>
          </>
        }
      />

      <DataTable
        title="Category list"
        description="Important fields only."
        data={sortedCategories}
        loading={loading}
        searchKeys={["name", "description"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" }
            ],
            getValue: (category) => (category.isActive ? "active" : "inactive")
          }
        ]}
        columns={[
          {
            key: "name",
            header: "Category",
            render: (category) => (
              <div className="space-y-1">
                <p className="font-medium text-white">{category.name}</p>
                <p className="text-xs text-slate-500">{category.description}</p>
              </div>
            )
          },
          {
            key: "status",
            header: "Status",
            render: (category) => (
              <Badge variant={category.isActive ? "success" : "neutral"}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            )
          },
          {
            key: "createdAt",
            header: "Created",
            render: (category) => <span className="text-slate-400">{formatDate(category.createdAt)}</span>
          }
        ]}
        renderRowActions={(category) => (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingCategory(category);
                setModalOpen(true);
              }}
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void handleToggle(category)}>
              <Power className="h-4 w-4" />
              Toggle
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-300" onClick={() => void handleDelete(category)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      />

      <FormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Update category" : "Create category"}
        description="Name and description only."
        schema={categorySchema}
        defaultValues={
          editingCategory
            ? {
                name: editingCategory.name,
                description: editingCategory.description
              }
            : defaultValues
        }
        fields={[
          { name: "name", label: "Category name", placeholder: "Gemstones" },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "All gemstone products"
          }
        ]}
        submitLabel={editingCategory ? "Save" : "Create"}
        pending={saving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

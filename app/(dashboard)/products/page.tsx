"use client";

import { Boxes, CircleDollarSign, Layers3, MinusCircle, PencilLine, Plus, Power, RefreshCw, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DataTable } from "@/components/data-table/data-table";
import type { FormFieldConfig } from "@/components/forms/entity-form";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/api/categories";
import { createProduct, deactivateProduct, deleteProduct, getAllProducts, updateProduct } from "@/lib/api/products";
import { getApiErrorMessage } from "@/lib/response-utils";
import { productSchema, type ProductFormValues } from "@/lib/schemas";
import type { Category, Product, TableColumn, TableFilter } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const initialProductValues: ProductFormValues = {
  name: "",
  price: 0,
  category: "",
  astrologyType: "gemstone",
  stock: 0,
  description: "",
  images: [],
  isActive: true,
  deliveryType: "physical"
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, categoryData] = await Promise.all([getAllProducts(), getAllCategories()]);
      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load products right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    if (editingProduct) {
      setExistingImages(editingProduct.images ?? []);
      setRemovedExistingImages([]);
      return;
    }

    setExistingImages([]);
    setRemovedExistingImages([]);
  }, [modalOpen, editingProduct]);

  const productColumns: TableColumn<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-card">
            {product.images && product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs text-slate-300">IMG</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{product.name}</p>
            <p className="truncate text-xs text-slate-500">{product.category} · {product.astrologyType}</p>
          </div>
        </div>
      )
    },
    {
      key: "price",
      header: "Price",
      render: (product) => <span className="font-medium text-white">{formatCurrency(product.price)}</span>
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => <Badge variant={product.stock <= 5 ? "danger" : "success"}>{product.stock} units</Badge>
    },
    {
      key: "deliveryType",
      header: "Delivery",
      render: (product) => <Badge variant="neutral" className="capitalize">{product.deliveryType}</Badge>
    },
    {
      key: "isActive",
      header: "Status",
      render: (product) => (
        <Badge variant={product.isActive ? "success" : "neutral"}>{product.isActive ? "Active" : "Inactive"}</Badge>
      )
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (product) => <span className="text-sm text-slate-400">{formatDate(product.updatedAt)}</span>
    }
  ];

  const productFilters: TableFilter<Product>[] = [
    {
      key: "status",
      label: "Status",
      allLabel: "All Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ],
      getValue: (product) => (product.isActive ? "active" : "inactive")
    },
    {
      key: "delivery",
      label: "Delivery",
      allLabel: "All Delivery",
      options: [
        { label: "Physical", value: "physical" },
        { label: "Digital", value: "digital" }
      ],
      getValue: (product) => product.deliveryType
    }
  ];

  const defaultValues = editingProduct
    ? {
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.categoryId || editingProduct.category,
        astrologyType: editingProduct.astrologyType,
        stock: editingProduct.stock,
        description: editingProduct.description,
        images: [],
        isActive: editingProduct.isActive,
        deliveryType: editingProduct.deliveryType
      }
    : initialProductValues;

  const fields: FormFieldConfig<ProductFormValues>[] = [
    { name: "name", label: "Product name", placeholder: "Gemstone Product" },
    { name: "price", label: "Price", type: "number" as const, placeholder: "500" },
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      options: categories.map((category) => ({
        label: category.name,
        value: category.id
      }))
    },
    {
      name: "astrologyType",
      label: "Astrology type",
      type: "select" as const,
      options: [
        { label: "Gemstone", value: "gemstone" },
        { label: "Puja", value: "puja" },
        { label: "Yantra", value: "yantra" },
        { label: "Consultation", value: "consultation" }
      ]
    },
    { name: "stock", label: "Stock", type: "number" as const, placeholder: "10" },
    {
      name: "deliveryType",
      label: "Delivery type",
      type: "select" as const,
      options: [
        { label: "Physical", value: "physical" },
        { label: "Digital", value: "digital" }
      ]
    },
    { name: "description", label: "Description", type: "textarea" as const, placeholder: "Describe the product..." },
    {
      name: "isActive",
      label: "Active",
      type: "switch" as const,
      description: "Keep this product visible in the storefront."
    },
    {
      name: "images",
      label: "Product images",
      type: "file" as const,
      multiple: true,
      accept: "image/*",
      description: "Upload one or more images. They are sent as multipart files."
    }
  ];

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setSaving(true);
      const payload: Record<string, unknown> = { ...values };

      if (editingProduct && removedExistingImages.length > 0) {
        payload.removedImages = JSON.stringify(removedExistingImages);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        toast.success("Product updated successfully.");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully.");
      }

      setModalOpen(false);
      setEditingProduct(null);
      setExistingImages([]);
      setRemovedExistingImages([]);
      await loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save product."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      toast.success("Product deleted successfully.");
      await loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete product."));
    }
  };

  const handleDeactivate = async (product: Product) => {
    try {
      await deactivateProduct(product.id);
      toast.success("Product deactivated successfully.");
      await loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to deactivate product."));
    }
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages((current) => current.filter((image) => image !== imageUrl));
    setRemovedExistingImages((current) => (current.includes(imageUrl) ? current : [...current, imageUrl]));
  };

  const activeProducts = products.filter((product) => product.isActive).length;
  const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Catalog"
        title="Products"
        description="Simple product management for browsing, editing, and maintaining the catalog."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void loadData()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New product
            </Button>
          </div>
        }
      />

      <SummaryCards
        showHelper={false}
        items={[
          {
            label: "Products",
            value: `${products.length}`,
            helper: "Total products synced from the catalog endpoint.",
            icon: Boxes,
            tone: "primary"
          },
          {
            label: "Active",
            value: `${activeProducts}`,
            helper: `${products.length - activeProducts} products are inactive.`,
            icon: Layers3,
            tone: "accent"
          },
          {
            label: "Low Stock",
            value: `${lowStockCount}`,
            helper: lowStockCount > 0 ? "These items need replenishment attention." : "Stock levels are healthy across the catalog.",
            icon: TriangleAlert,
            tone: lowStockCount > 0 ? "danger" : "success"
          },
          {
            label: "Value",
            value: formatCurrency(inventoryValue),
            helper: `${categories.length} categories available.`,
            icon: CircleDollarSign,
            tone: "neutral"
          }
        ]}
      />

      <DataTable
        title="Product Inventory"
        description="Search, filter, and review products in a simple table layout."
        data={products}
        columns={productColumns}
        searchKeys={["name", "category", "astrologyType", "deliveryType", "description"]}
        filters={productFilters}
        sortOptions={[
          {
            label: "Newest",
            value: "newest",
            compare: (left, right) =>
              new Date(right.updatedAt ?? right.createdAt ?? 0).getTime() -
              new Date(left.updatedAt ?? left.createdAt ?? 0).getTime()
          },
          {
            label: "Price: Low to High",
            value: "price-asc",
            compare: (left, right) => left.price - right.price
          },
          {
            label: "Price: High to Low",
            value: "price-desc",
            compare: (left, right) => right.price - left.price
          },
          {
            label: "Stock: Low to High",
            value: "stock-asc",
            compare: (left, right) => left.stock - right.stock
          },
          {
            label: "Stock: High to Low",
            value: "stock-desc",
            compare: (left, right) => right.stock - left.stock
          },
          {
            label: "Status: Active First",
            value: "status-active",
            compare: (left, right) => Number(right.isActive) - Number(left.isActive)
          }
        ]}
        loading={loading}
        renderRowActions={(product) => (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingProduct(product);
                setModalOpen(true);
              }}
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void handleDeactivate(product)}>
              <Power className="h-4 w-4" />
              Deactivate
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-300" onClick={() => void handleDelete(product)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}
        emptyTitle="No products found"
        emptyDescription="Try a different search term or clear the filters."
      />

      <FormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
          setExistingImages([]);
          setRemovedExistingImages([]);
        }}
        title={editingProduct ? "Update product" : "Create product"}
        description="Payloads are aligned with the AstroNexus Postman collection."
        schema={productSchema}
        defaultValues={defaultValues}
        fields={fields}
        extraContent={
          editingProduct ? (
            <div className="mb-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Existing images</p>
                <p className="text-xs text-slate-500">
                  {existingImages.length} remaining
                  {removedExistingImages.length > 0 ? ` | ${removedExistingImages.length} marked for removal` : ""}
                </p>
              </div>

              {existingImages.length === 0 ? (
                <p className="text-xs text-slate-500">No existing images left. Upload new images below.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {existingImages.map((imageUrl) => (
                    <div key={imageUrl} className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                      <img src={imageUrl} alt="Existing product" className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/90 text-white transition hover:bg-rose-500"
                        aria-label="Remove image"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null
        }
        submitLabel={editingProduct ? "Save changes" : "Create product"}
        pending={saving}
        onSubmit={handleSubmit}
        size="xl"
      />
    </div>
  );
}

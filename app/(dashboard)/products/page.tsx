"use client";

import {
  Boxes,
  CircleDollarSign,
  Layers3,
  MinusCircle,
  PencilLine,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2,
  TriangleAlert
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { SummaryCards } from "@/components/dashboard/summary-cards";
import type { FormFieldConfig } from "@/components/forms/entity-form";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCategories } from "@/lib/api/categories";
import { createProduct, deactivateProduct, deleteProduct, getAllProducts, updateProduct } from "@/lib/api/products";
import { getApiErrorMessage } from "@/lib/response-utils";
import { productSchema, type ProductFormValues } from "@/lib/schemas";
import type { Category, Product } from "@/lib/types";
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

function shortenText(value: string, maxLength = 150) {
  if (!value) {
    return "No description provided.";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

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
      const payload: Record<string, unknown> = {
        ...values
      };

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

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const rows = products.filter((product) => {
      const matchesQuery =
        query.length === 0 ||
        [product.name, product.description, product.category, product.astrologyType, product.deliveryType]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? product.isActive : !product.isActive);

      const matchesDelivery = deliveryFilter === "all" || product.deliveryType === deliveryFilter;

      return matchesQuery && matchesStatus && matchesDelivery;
    });

    const sorted = [...rows];

    if (sortBy === "price-asc") {
      sorted.sort((left, right) => left.price - right.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((left, right) => right.price - left.price);
    } else if (sortBy === "stock-desc") {
      sorted.sort((left, right) => right.stock - left.stock);
    } else {
      sorted.sort(
        (left, right) =>
          new Date(right.updatedAt ?? right.createdAt ?? 0).getTime() -
          new Date(left.updatedAt ?? left.createdAt ?? 0).getTime()
      );
    }

    return sorted;
  }, [products, search, statusFilter, deliveryFilter, sortBy]);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Catalog"
        title="Products"
        description="Create, update, deactivate, and monitor AstroNexus products with reusable forms and searchable controls."
        actions={
          <>
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
          </>
        }
      />

      <SummaryCards
        showHelper={false}
        items={[
          {
            label: "Catalog Size",
            value: `${products.length}`,
            helper: "Total products currently synced from the admin product endpoint.",
            icon: Boxes,
            tone: "primary"
          },
          {
            label: "Live Listings",
            value: `${activeProducts}`,
            helper: `${products.length - activeProducts} entries are currently inactive or hidden.`,
            icon: Layers3,
            tone: "accent"
          },
          {
            label: "Low Stock",
            value: `${lowStockCount}`,
            helper:
              lowStockCount > 0
                ? "Replenishment attention is needed for part of the catalog."
                : "Inventory levels are currently healthy across the catalog.",
            icon: TriangleAlert,
            tone: lowStockCount > 0 ? "danger" : "success"
          },
          {
            label: "Inventory Value",
            value: formatCurrency(inventoryValue),
            helper: `${categories.length} categories are available for product mapping.`,
            icon: CircleDollarSign,
            tone: "neutral"
          }
        ]}
      />

      <Card>
        <CardHeader className="gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Product Inventory Grid</CardTitle>
              <CardDescription>Card-based browsing for image-heavy catalog management.</CardDescription>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, category, type..."
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Select value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value)}>
                <option value="all">All Delivery</option>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </Select>
              <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="latest">Latest</option>
                <option value="price-asc">Price low</option>
                <option value="price-desc">Price high</option>
                <option value="stock-desc">Stock high</option>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[340px] rounded-3xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
              No products found for the selected filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const previewImages = product.images.slice(0, 3);
                const extraImages = product.images.length - previewImages.length;

                return (
                  <article key={product.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="grid h-40 grid-cols-3 gap-2">
                      {previewImages.length > 0 ? (
                        <>
                          <div className="col-span-2 h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                            <img src={previewImages[0]} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="grid gap-2">
                            {previewImages.slice(1).map((image, index) => (
                              <div
                                key={`${product.id}-preview-${index}`}
                                className="h-[76px] overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                              >
                                <img src={image} alt={`${product.name} ${index + 2}`} className="h-full w-full object-cover" />
                              </div>
                            ))}
                            {previewImages.length === 1 ? (
                              <div className="h-[76px] rounded-xl border border-white/10 bg-white/5" />
                            ) : null}
                          </div>
                        </>
                      ) : (
                        <div className="col-span-3 flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-slate-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-white">{product.name}</p>
                        <p className="text-sm leading-6 text-slate-400">{shortenText(product.description)}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={product.isActive ? "success" : "neutral"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                        <Badge variant={product.stock <= 5 ? "danger" : "success"}>{product.stock} units</Badge>
                        <Badge variant="neutral" className="capitalize">{product.deliveryType}</Badge>
                        {extraImages > 0 ? <Badge variant="accent">+{extraImages} images</Badge> : null}
                      </div>

                      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/15 p-3 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Price</p>
                          <p className="mt-1 font-medium text-white">{formatCurrency(product.price)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Category</p>
                          <p className="mt-1 font-medium text-white">{product.category}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Type</p>
                          <p className="mt-1 text-sm uppercase tracking-[0.12em] text-slate-300">{product.astrologyType}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500">Updated: {formatDate(product.updatedAt)}</p>

                      <div className="flex flex-wrap gap-2">
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
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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

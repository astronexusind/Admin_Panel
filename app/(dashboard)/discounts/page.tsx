"use client";

import { Copy, PencilLine, Plus, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createDiscount, getAllDiscounts, updateDiscount } from "@/lib/api/discounts";
import { getApiErrorMessage } from "@/lib/response-utils";
import { discountSchema, type DiscountFormValues } from "@/lib/schemas";
import type { Discount } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const defaultValues: DiscountFormValues = {
  code: "",
  percentage: 10,
  expiry: new Date().toISOString().slice(0, 16)
};

function isActiveDiscount(discount: Discount) {
  return Boolean(discount.expiry) && new Date(discount.expiry).getTime() > Date.now();
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      setDiscounts(await getAllDiscounts());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load discounts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDiscounts();
  }, []);

  const handleSubmit = async (values: DiscountFormValues) => {
    try {
      setSaving(true);
      const payload = {
        ...values,
        expiry: new Date(values.expiry).toISOString()
      };

      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, payload);
        toast.success("Coupon updated.");
      } else {
        await createDiscount(payload);
        toast.success("Coupon created.");
      }

      setModalOpen(false);
      setEditingDiscount(null);
      await loadDiscounts();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save coupon."));
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied.");
    } catch {
      toast.error("Copy failed.");
    }
  };

  const sortedDiscounts = useMemo(
    () =>
      [...discounts].sort(
        (left, right) => new Date(right.expiry || 0).getTime() - new Date(left.expiry || 0).getTime()
      ),
    [discounts]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Promotions"
        title="Discounts"
        description="Manage coupon codes and expiry."
        actions={
          <>
            <Button variant="outline" onClick={() => void loadDiscounts()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                setEditingDiscount(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New coupon
            </Button>
          </>
        }
      />

      <DataTable
        title="Coupon list"
        description="Only active and expired coupon essentials."
        data={sortedDiscounts}
        loading={loading}
        searchKeys={["code", "expiry"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" }
            ],
            getValue: (discount) => (isActiveDiscount(discount) ? "active" : "expired")
          }
        ]}
        columns={[
          {
            key: "code",
            header: "Coupon",
            render: (discount) => (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{discount.code}</span>
                <Button variant="ghost" size="sm" onClick={() => void handleCopyCode(discount.code)}>
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            )
          },
          {
            key: "percentage",
            header: "Discount",
            render: (discount) => <span className="font-medium text-white">{discount.percentage}%</span>
          },
          {
            key: "expiry",
            header: "Expiry",
            render: (discount) => <span className="text-slate-300">{formatDate(discount.expiry)}</span>
          },
          {
            key: "status",
            header: "Status",
            render: (discount) => (
              <Badge variant={isActiveDiscount(discount) ? "success" : "neutral"}>
                {isActiveDiscount(discount) ? "Active" : "Expired"}
              </Badge>
            )
          }
        ]}
        renderRowActions={(discount) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingDiscount(discount);
              setModalOpen(true);
            }}
          >
            <PencilLine className="h-4 w-4" />
            Edit
          </Button>
        )}
      />

      <FormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDiscount(null);
        }}
        title={editingDiscount ? "Update coupon" : "Create coupon"}
        description="Coupon code, discount, and expiry only."
        schema={discountSchema}
        defaultValues={
          editingDiscount
            ? {
                code: editingDiscount.code,
                percentage: editingDiscount.percentage,
                expiry: editingDiscount.expiry ? editingDiscount.expiry.slice(0, 16) : defaultValues.expiry
              }
            : defaultValues
        }
        fields={[
          { name: "code", label: "Code", placeholder: "NEWYEAR" },
          { name: "percentage", label: "Percentage", type: "number", placeholder: "10" },
          { name: "expiry", label: "Expiry", type: "datetime-local" }
        ]}
        submitLabel={editingDiscount ? "Save" : "Create"}
        pending={saving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

"use client";

import { PencilLine, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteOrder, getAllOrders, updateOrderStatus } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/lib/response-utils";
import { orderStatusSchema, type OrderStatusFormValues } from "@/lib/schemas";
import type { Order } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const defaultStatusValues: OrderStatusFormValues = {
  status: "Pending"
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setOrders(await getAllOrders());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load orders right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const handleUpdateStatus = async (values: OrderStatusFormValues) => {
    if (!editingOrder) {
      return;
    }

    try {
      setSaving(true);
      await updateOrderStatus(editingOrder.id, values);
      toast.success("Order status updated successfully.");
      setModalOpen(false);
      setEditingOrder(null);
      await loadOrders();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update order status."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    if (!window.confirm(`Delete order ${order.id}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteOrder(order.id);
      toast.success("Order deleted successfully.");
      await loadOrders();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete order."));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Fulfillment"
        title="Orders"
        description="Track, update status, and delete stale orders."
        actions={
          <Button variant="outline" onClick={() => void loadOrders()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <DataTable
        title="Order list"
        description="Important order fields only."
        data={orders}
        loading={loading}
        searchKeys={["id", "customerName", "customerEmail", "status"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Processing", value: "Processing" },
              { label: "Shipped", value: "Shipped" },
              { label: "Delivered", value: "Delivered" }
            ],
            getValue: (order) => order.status
          }
        ]}
        columns={[
          {
            key: "id",
            header: "Order",
            render: (order) => (
              <div className="space-y-1">
                <p className="font-medium text-white">{order.id}</p>
                <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
              </div>
            )
          },
          {
            key: "customer",
            header: "Customer",
            render: (order) => (
              <div className="space-y-1">
                <p className="text-white">{order.customerName}</p>
                <p className="text-xs text-slate-500">{order.customerEmail}</p>
              </div>
            )
          },
          {
            key: "total",
            header: "Total",
            render: (order) => <span className="font-medium text-white">{formatCurrency(order.total)}</span>
          },
          {
            key: "status",
            header: "Status",
            render: (order) => {
              const variant =
                order.status.toLowerCase().includes("deliver")
                  ? "success"
                  : order.status.toLowerCase().includes("pending")
                    ? "accent"
                    : "neutral";

              return <Badge variant={variant}>{order.status}</Badge>;
            }
          },
          {
            key: "itemsCount",
            header: "Items",
            render: (order) => order.itemsCount
          }
        ]}
        renderRowActions={(order) => (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingOrder(order);
                setModalOpen(true);
              }}
            >
              <PencilLine className="h-4 w-4" />
              Update
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-300" onClick={() => void handleDeleteOrder(order)}>
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
          setEditingOrder(null);
        }}
        title="Update order status"
        description="Matches `PUT /api/admin/orders/:id/status`."
        schema={orderStatusSchema}
        defaultValues={editingOrder ? { status: editingOrder.status } : defaultStatusValues}
        fields={[
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Processing", value: "Processing" },
              { label: "Shipped", value: "Shipped" },
              { label: "Delivered", value: "Delivered" },
              { label: "Cancelled", value: "Cancelled" }
            ]
          }
        ]}
        submitLabel="Update status"
        pending={saving}
        onSubmit={handleUpdateStatus}
      />
    </div>
  );
}

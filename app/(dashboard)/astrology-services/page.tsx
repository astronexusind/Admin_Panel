"use client";

import { PencilLine, Plus, ToggleLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createAstrologyService,
  deleteAstrologyService,
  getAllAstrologyServices,
  toggleAstrologyService,
  updateAstrologyService
} from "@/lib/api/astrology-services";
import { getApiErrorMessage } from "@/lib/response-utils";
import { astrologyServiceSchema, type AstrologyServiceFormValues } from "@/lib/schemas";
import type { AstrologyService } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const defaultValues: AstrologyServiceFormValues = {
  name: "",
  key: "",
  description: "",
  enabled: true,
  isPremium: false
};

export default function AstrologyServicesPage() {
  const [services, setServices] = useState<AstrologyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AstrologyService | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      setServices(await getAllAstrologyServices());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load astrology services right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const handleSubmit = async (values: AstrologyServiceFormValues) => {
    try {
      setSaving(true);

      if (editingService) {
        await updateAstrologyService(editingService.id, values);
        toast.success("Astrology service updated successfully.");
      } else {
        await createAstrologyService(values);
        toast.success("Astrology service created successfully.");
      }

      setModalOpen(false);
      setEditingService(null);
      await loadServices();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save astrology service."));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (service: AstrologyService) => {
    try {
      await toggleAstrologyService(service.id, !service.enabled);
      toast.success("Service status updated.");
      await loadServices();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to toggle service status."));
    }
  };

  const handleDelete = async (service: AstrologyService) => {
    if (!window.confirm(`Delete ${service.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteAstrologyService(service.id);
      toast.success("Astrology service deleted successfully.");
      await loadServices();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete astrology service."));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Service Engine"
        title="Astrology Services"
        description="Manage astrology services from backend configuration."
        actions={
          <Button
            onClick={() => {
              setEditingService(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New service
          </Button>
        }
      />

      <DataTable
        title="Service catalog"
        description="Manage service keys, activation status, and premium configuration."
        data={services}
        loading={loading}
        searchKeys={["name", "key", "description"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Enabled", value: "enabled" },
              { label: "Disabled", value: "disabled" }
            ],
            getValue: (service) => (service.enabled ? "enabled" : "disabled")
          },
          {
            key: "tier",
            label: "Tier",
            options: [
              { label: "Premium", value: "premium" },
              { label: "Standard", value: "standard" }
            ],
            getValue: (service) => (service.isPremium ? "premium" : "standard")
          }
        ]}
        columns={[
          {
            key: "name",
            header: "Service",
            render: (service) => (
              <div className="space-y-1">
                <p className="font-medium text-white">{service.name}</p>
                <p className="text-xs text-slate-500">{service.description}</p>
              </div>
            )
          },
          {
            key: "key",
            header: "Key",
            render: (service) => <span className="uppercase tracking-[0.18em] text-slate-400">{service.key}</span>
          },
          {
            key: "enabled",
            header: "Status",
            render: (service) => <Badge variant={service.enabled ? "success" : "neutral"}>{service.enabled ? "Enabled" : "Disabled"}</Badge>
          },
          {
            key: "isPremium",
            header: "Tier",
            render: (service) => <Badge variant={service.isPremium ? "accent" : "neutral"}>{service.isPremium ? "Premium" : "Standard"}</Badge>
          },
          {
            key: "updatedAt",
            header: "Updated",
            render: (service) => <span className="text-slate-400">{formatDate(service.updatedAt)}</span>
          }
        ]}
        renderRowActions={(service) => (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingService(service);
                setModalOpen(true);
              }}
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void handleToggle(service)}>
              <ToggleLeft className="h-4 w-4" />
              {service.enabled ? "Disable" : "Enable"}
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-300" onClick={() => void handleDelete(service)}>
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
          setEditingService(null);
        }}
        title={editingService ? "Update astrology service" : "Create astrology service"}
        description="Matches astrology service endpoints from the Postman collection."
        schema={astrologyServiceSchema}
        defaultValues={
          editingService
            ? {
                name: editingService.name,
                key: editingService.key,
                description: editingService.description,
                enabled: editingService.enabled,
                isPremium: editingService.isPremium
              }
            : defaultValues
        }
        fields={[
          { name: "name", label: "Service name", placeholder: "Kundli" },
          { name: "key", label: "Service key", placeholder: "kundli" },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Kundli generation service"
          },
          {
            name: "enabled",
            label: "Enabled",
            type: "switch",
            description: "Allow this service in storefront and workflows."
          },
          {
            name: "isPremium",
            label: "Premium",
            type: "switch",
            description: "Require premium plan to access this service."
          }
        ]}
        submitLabel={editingService ? "Save changes" : "Create service"}
        pending={saving}
        onSubmit={handleSubmit}
        size="xl"
      />
    </div>
  );
}

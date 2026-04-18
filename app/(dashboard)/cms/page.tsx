"use client";

import { PencilLine, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createCmsContent, getAllCmsContent, updateCmsContent } from "@/lib/api/cms";
import { getApiErrorMessage } from "@/lib/response-utils";
import { cmsSchema, type CmsFormValues } from "@/lib/schemas";
import type { CmsContent } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const defaultValues: CmsFormValues = {
  type: "banner",
  title: "",
  content: "",
  image: "",
  isActive: true
};

export default function CmsPage() {
  const [contentItems, setContentItems] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CmsContent | null>(null);

  const loadContent = async () => {
    try {
      setLoading(true);
      setContentItems(await getAllCmsContent());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load CMS content."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContent();
  }, []);

  const handleSubmit = async (values: CmsFormValues) => {
    try {
      setSaving(true);
      if (editingItem) {
        await updateCmsContent(editingItem.id, values);
        toast.success("Content updated successfully.");
      } else {
        await createCmsContent(values);
        toast.success("Content created successfully.");
      }
      setModalOpen(false);
      setEditingItem(null);
      await loadContent();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save content."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CMS"
        title="Content Management"
        description="Manage content title, type, status, and message."
        actions={
          <>
            <Button variant="outline" onClick={() => void loadContent()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New content
            </Button>
          </>
        }
      />

      <DataTable
        title="Content list"
        description="Important fields only."
        data={contentItems}
        loading={loading}
        searchKeys={["type", "title", "content"]}
        filters={[
          {
            key: "type",
            label: "Type",
            options: [
              { label: "Banner", value: "banner" },
              { label: "Section", value: "section" },
              { label: "Popup", value: "popup" }
            ],
            getValue: (item) => item.type
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" }
            ],
            getValue: (item) => (item.isActive ? "active" : "inactive")
          }
        ]}
        columns={[
          {
            key: "title",
            header: "Content",
            render: (item) => (
              <div className="space-y-1">
                <p className="font-medium text-white">{item.title}</p>
                <p className="max-w-xl text-xs leading-5 text-slate-500">{item.content}</p>
              </div>
            )
          },
          {
            key: "type",
            header: "Type",
            render: (item) => <span className="capitalize">{item.type}</span>
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <Badge variant={item.isActive ? "success" : "neutral"}>{item.isActive ? "Active" : "Inactive"}</Badge>
            )
          },
          {
            key: "updatedAt",
            header: "Updated",
            render: (item) => <span className="text-slate-400">{formatDate(item.updatedAt)}</span>
          }
        ]}
        renderRowActions={(item) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingItem(item);
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
          setEditingItem(null);
        }}
        title={editingItem ? "Update content" : "Create content"}
        description="Type, title, image URL, message, and status."
        schema={cmsSchema}
        defaultValues={
          editingItem
            ? {
                type: editingItem.type,
                title: editingItem.title,
                content: editingItem.content,
                image: editingItem.image,
                isActive: editingItem.isActive
              }
            : defaultValues
        }
        fields={[
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { label: "Banner", value: "banner" },
              { label: "Section", value: "section" },
              { label: "Popup", value: "popup" }
            ]
          },
          { name: "title", label: "Title", placeholder: "Welcome Banner" },
          { name: "image", label: "Image URL", placeholder: "https://..." },
          { name: "content", label: "Content", type: "textarea", placeholder: "Welcome to our site!" },
          {
            name: "isActive",
            label: "Active",
            type: "switch",
            description: "Show this content live on the website."
          }
        ]}
        submitLabel={editingItem ? "Save changes" : "Create content"}
        pending={saving}
        onSubmit={handleSubmit}
        size="xl"
      />
    </div>
  );
}

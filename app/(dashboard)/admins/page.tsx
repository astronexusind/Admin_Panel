"use client";

import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getAllAdmins, updateAdminPassword } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/response-utils";
import { passwordUpdateSchema, type PasswordUpdateFormValues } from "@/lib/schemas";
import type { AdminProfile } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const defaultValues: PasswordUpdateFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setAdmins(await getAllAdmins());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load admin directory."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdmins();
  }, []);

  const handlePasswordUpdate = async (values: PasswordUpdateFormValues) => {
    try {
      setSaving(true);
      await updateAdminPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      toast.success("Password updated successfully.");
      setModalOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update password."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Security"
        title="Admins"
        description="Manage admin access list and update password securely."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <KeyRound className="h-4 w-4" />
            Update password
          </Button>
        }
      />

      <DataTable
        title="Admin directory"
        description="View and manage all admin accounts."
        data={admins}
        loading={loading}
        searchKeys={["name", "email", "role"]}
        columns={[
          {
            key: "identity",
            header: "Admin",
            render: (admin) => (
              <div className="space-y-1">
                <p className="font-medium text-white">{admin.name}</p>
                <p className="text-xs text-slate-500">{admin.email}</p>
              </div>
            )
          },
          {
            key: "role",
            header: "Role",
            render: (admin) => admin.role
          },
          {
            key: "lastLogin",
            header: "Last Login",
            render: (admin) => <span className="text-slate-400">{formatDate(admin.lastLogin)}</span>
          }
        ]}
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Update admin password"
        description="Uses `PUT /api/admin/auth/update-password` from the Postman collection."
        schema={passwordUpdateSchema}
        defaultValues={defaultValues}
        fields={[
          { name: "oldPassword", label: "Current password", type: "password", placeholder: "oldpassword" },
          { name: "newPassword", label: "New password", type: "password", placeholder: "newpassword" },
          { name: "confirmPassword", label: "Confirm new password", type: "password", placeholder: "newpassword" }
        ]}
        submitLabel="Update password"
        pending={saving}
        onSubmit={handlePasswordUpdate}
      />
    </div>
  );
}

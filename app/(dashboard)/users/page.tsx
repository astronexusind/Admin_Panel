"use client";

import { Ban, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { FormModal } from "@/components/forms/form-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blockUser, createAstrologyUser, deleteUser, getAllUsers } from "@/lib/api/users";
import { getApiErrorMessage } from "@/lib/response-utils";
import { astrologyUserSchema, type AstrologyUserFormValues } from "@/lib/schemas";
import type { User } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const defaultValues: AstrologyUserFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  timeOfBirth: "",
  placeOfBirth: "",
  tempChartId: ""
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setUsers(await getAllUsers());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleCreateUser = async (values: AstrologyUserFormValues) => {
    try {
      setSaving(true);
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        astrologyProfile: {
          dateOfBirth: values.dateOfBirth,
          timeOfBirth: values.timeOfBirth,
          placeOfBirth: values.placeOfBirth
        },
        ...(values.tempChartId ? { tempChartId: values.tempChartId } : {})
      };

      await createAstrologyUser(payload);
      toast.success("Astrology user created.");
      setModalOpen(false);
      await loadUsers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create astrology user."));
    } finally {
      setSaving(false);
    }
  };

  const handleBlockUser = async (user: User) => {
    try {
      await blockUser(user.id);
      toast.success(user.isBlocked ? "User already blocked." : `${user.name} blocked.`);
      await loadUsers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to block user."));
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(user.id);
      toast.success("User deleted.");
      await loadUsers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete user."));
    }
  };

  const sortedUsers = useMemo(
    () => [...users].sort((left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()),
    [users]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Community"
        title="Users"
        description="Manage users, roles, and moderation status."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create user
          </Button>
        }
      />

      <DataTable
        title="User list"
        description="Important account details only."
        data={sortedUsers}
        loading={loading}
        searchKeys={["name", "email", "phone", "role"]}
        filters={[
          {
            key: "role",
            label: "Role",
            options: [
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" }
            ],
            getValue: (user) => user.role.toLowerCase()
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Blocked", value: "blocked" }
            ],
            getValue: (user) => (user.isBlocked ? "blocked" : "active")
          }
        ]}
        columns={[
          {
            key: "identity",
            header: "User",
            render: (user) => (
              <div className="flex items-center gap-3">
                <Avatar name={user.name} className="h-9 w-9 rounded-xl text-xs" />
                <div className="space-y-1">
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            )
          },
          { key: "phone", header: "Phone", render: (user) => user.phone || "N/A" },
          {
            key: "role",
            header: "Role",
            render: (user) => <span className="uppercase tracking-[0.12em] text-slate-300">{user.role}</span>
          },
          {
            key: "status",
            header: "Status",
            render: (user) => (
              <Badge variant={user.isBlocked ? "danger" : "success"}>{user.isBlocked ? "Blocked" : "Active"}</Badge>
            )
          },
          { key: "createdAt", header: "Created", render: (user) => <span className="text-slate-400">{formatDate(user.createdAt)}</span> }
        ]}
        renderRowActions={(user) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => void handleBlockUser(user)} disabled={user.isBlocked}>
              <Ban className="h-4 w-4" />
              {user.isBlocked ? "Blocked" : "Block"}
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-300" onClick={() => void handleDeleteUser(user)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create astrology user"
        description="Create a normal user with astrology profile details."
        schema={astrologyUserSchema}
        defaultValues={defaultValues}
        fields={[
          { name: "name", label: "Name", placeholder: "New User" },
          { name: "email", label: "Email", type: "email", placeholder: "newuser@example.com" },
          { name: "phone", label: "Phone", placeholder: "+1234567890" },
          { name: "password", label: "Password", type: "password", placeholder: "password123" },
          { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "password123" },
          { name: "dateOfBirth", label: "Date of Birth", placeholder: "YYYY-MM-DD" },
          { name: "timeOfBirth", label: "Time of Birth", placeholder: "HH:MM" },
          { name: "placeOfBirth", label: "Place of Birth", placeholder: "City, Country" },
          {
            name: "tempChartId",
            label: "Temporary chart ID",
            placeholder: "optional_temp_chart_id",
            description: "Optional existing temporary birth chart id. Leave empty if you do not have one."
          }
        ]}
        submitLabel="Create user"
        pending={saving}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}

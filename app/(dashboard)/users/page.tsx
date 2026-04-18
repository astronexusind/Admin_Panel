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
import { blockUser, createUser, deleteUser, getAllUsers } from "@/lib/api/users";
import { getApiErrorMessage } from "@/lib/response-utils";
import { userSchema, type UserFormValues } from "@/lib/schemas";
import type { User } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "user"
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

  const handleCreateUser = async (values: UserFormValues) => {
    try {
      setSaving(true);
      await createUser(values);
      toast.success("User created.");
      setModalOpen(false);
      await loadUsers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create user."));
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
    () =>
      [...users].sort(
        (left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
      ),
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
              <Badge variant={user.isBlocked ? "danger" : "success"}>
                {user.isBlocked ? "Blocked" : "Active"}
              </Badge>
            )
          },
          {
            key: "createdAt",
            header: "Created",
            render: (user) => <span className="text-slate-400">{formatDate(user.createdAt)}</span>
          }
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
        title="Create user"
        description="Name, email, phone, password, role."
        schema={userSchema}
        defaultValues={defaultValues}
        fields={[
          { name: "name", label: "Name", placeholder: "New User" },
          { name: "email", label: "Email", type: "email", placeholder: "newuser@example.com" },
          { name: "phone", label: "Phone", placeholder: "+1234567890" },
          { name: "password", label: "Password", type: "password", placeholder: "password123" },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: [
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" }
            ]
          }
        ]}
        submitLabel="Create"
        pending={saving}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}

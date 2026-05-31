import endpoints from "@/config/endpoints";
import api from "@/lib/axios";
import { normalizeAdmin } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse, getObjectFromResponse, getString } from "@/lib/response-utils";
import type { AdminProfile } from "@/lib/types";

export async function loginAdmin(payload: { email: string; password: string }) {
  const response = await api.post(endpoints.auth.login, payload);
  const source = getObjectFromResponse<Record<string, unknown>>(response.data) ?? {};
  const nested = getObjectFromResponse<Record<string, unknown>>(source.data) ?? {};
  const token = getString(source.token ?? nested.token);
  const adminSource = source.admin ?? source.user ?? nested.admin ?? nested.user ?? {
    email: payload.email,
    name: "AstroNexus Admin"
  };

  if (!token) {
    throw new Error("Login succeeded but no token was returned by the backend.");
  }

  return {
    token,
    admin: normalizeAdmin(adminSource),
    message: getMessageFromResponse(response.data, "Welcome back to AstroNexus.")
  };
}

export async function getAllAdmins() {
  const response = await api.get(endpoints.auth.all);

  return getArrayFromResponse<unknown>(response.data, ["admins"]).map((item, index) =>
    normalizeAdmin(item, index)
  );
}

export async function updateAdminPassword(payload: { oldPassword: string; newPassword: string }) {
  const response = await api.put(endpoints.auth.updatePassword, payload);

  return getMessageFromResponse(response.data, "Password updated successfully.");
}

export async function logoutAdmin() {
  const response = await api.post(endpoints.auth.logout);

  return getMessageFromResponse(response.data, "Logged out successfully.");
}

export function getFallbackAdmin(email: string): AdminProfile {
  return {
    id: "current-admin",
    name: "AstroNexus Admin",
    email,
    role: "Admin",
    lastLogin: new Date().toISOString()
  };
}

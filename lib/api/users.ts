import endpoints from "@/config/endpoints.json";
import api from "@/lib/axios";
import { normalizeUser } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

export async function getAllUsers() {
  const response = await api.get(endpoints.users.list);

  return getArrayFromResponse<unknown>(response.data, ["users"]).map((item, index) =>
    normalizeUser(item, index)
  );
}

export async function createUser(payload: Record<string, unknown>) {
  const response = await api.post(endpoints.users.create, payload);

  return getMessageFromResponse(response.data, "User created successfully.");
}

export async function blockUser(id: string) {
  const response = await api.patch(replacePathParam(endpoints.users.block, "id", id));

  return getMessageFromResponse(response.data, "User status updated.");
}

export async function deleteUser(id: string) {
  const response = await api.delete(replacePathParam(endpoints.users.delete, "id", id));

  return getMessageFromResponse(response.data, "User deleted successfully.");
}

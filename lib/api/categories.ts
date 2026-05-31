import endpoints from "@/config/endpoints";
import api from "@/lib/axios";
import { normalizeCategory } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

export async function getAllCategories() {
  const response = await api.get(endpoints.categories.list);

  return getArrayFromResponse<unknown>(response.data, ["categories"]).map((item, index) =>
    normalizeCategory(item, index)
  );
}

export async function createCategory(payload: Record<string, unknown>) {
  const response = await api.post(endpoints.categories.create, payload);

  return getMessageFromResponse(response.data, "Category created successfully.");
}

export async function updateCategory(id: string, payload: Record<string, unknown>) {
  const response = await api.put(replacePathParam(endpoints.categories.update, "id", id), payload);

  return getMessageFromResponse(response.data, "Category updated successfully.");
}

export async function toggleCategory(id: string) {
  const response = await api.patch(replacePathParam(endpoints.categories.toggle, "id", id));

  return getMessageFromResponse(response.data, "Category state changed successfully.");
}

export async function deleteCategory(id: string) {
  const response = await api.delete(replacePathParam(endpoints.categories.delete, "id", id));

  return getMessageFromResponse(response.data, "Category deleted successfully.");
}

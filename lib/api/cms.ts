import endpoints from "@/config/endpoints.json";
import api from "@/lib/axios";
import { normalizeCmsContent } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

export async function getAllCmsContent() {
  const response = await api.get(endpoints.cms.list);

  return getArrayFromResponse<unknown>(response.data, ["content", "cms"]).map((item, index) =>
    normalizeCmsContent(item, index)
  );
}

export async function createCmsContent(payload: Record<string, unknown>) {
  const response = await api.post(endpoints.cms.create, payload);

  return getMessageFromResponse(response.data, "Content created successfully.");
}

export async function updateCmsContent(id: string, payload: Record<string, unknown>) {
  const response = await api.put(replacePathParam(endpoints.cms.update, "id", id), payload);

  return getMessageFromResponse(response.data, "Content updated successfully.");
}

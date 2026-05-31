import endpoints from "@/config/endpoints";
import api from "@/lib/axios";
import { normalizeAstrologyService } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

export async function getAllAstrologyServices() {
  const response = await api.get(endpoints.astrologyServices.list);

  return getArrayFromResponse<unknown>(response.data, ["services", "astrologyServices"]).map((item, index) =>
    normalizeAstrologyService(item, index)
  );
}

export async function createAstrologyService(payload: Record<string, unknown>) {
  const response = await api.post(endpoints.astrologyServices.create, payload);

  return getMessageFromResponse(response.data, "Astrology service created successfully.");
}

export async function updateAstrologyService(id: string, payload: Record<string, unknown>) {
  const response = await api.put(replacePathParam(endpoints.astrologyServices.update, "id", id), payload);

  return getMessageFromResponse(response.data, "Astrology service updated successfully.");
}

export async function toggleAstrologyService(id: string, enabled: boolean) {
  const response = await api.patch(replacePathParam(endpoints.astrologyServices.toggle, "id", id), { enabled });

  return getMessageFromResponse(response.data, "Astrology service status updated.");
}

export async function deleteAstrologyService(id: string) {
  const response = await api.delete(replacePathParam(endpoints.astrologyServices.delete, "id", id));

  return getMessageFromResponse(response.data, "Astrology service deleted successfully.");
}

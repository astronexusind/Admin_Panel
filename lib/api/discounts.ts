import endpoints from "@/config/endpoints";
import api from "@/lib/axios";
import { normalizeDiscount } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

export async function getAllDiscounts() {
  const response = await api.get(endpoints.discounts.list);

  return getArrayFromResponse<unknown>(response.data, ["discounts"]).map((item, index) =>
    normalizeDiscount(item, index)
  );
}

export async function createDiscount(payload: Record<string, unknown>) {
  const response = await api.post(endpoints.discounts.create, payload);

  return getMessageFromResponse(response.data, "Discount created successfully.");
}

export async function updateDiscount(id: string, payload: Record<string, unknown>) {
  const response = await api.put(replacePathParam(endpoints.discounts.update, "discountId", id), payload);

  return getMessageFromResponse(response.data, "Discount updated successfully.");
}

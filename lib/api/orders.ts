import endpoints from "@/config/endpoints.json";
import api from "@/lib/axios";
import { normalizeOrder } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

export async function getAllOrders() {
  const response = await api.get(endpoints.orders.list);

  return getArrayFromResponse<unknown>(response.data, ["orders"]).map((item, index) =>
    normalizeOrder(item, index)
  );
}

export async function updateOrderStatus(id: string, payload: { status: string }) {
  const response = await api.put(replacePathParam(endpoints.orders.updateStatus, "id", id), payload);

  return getMessageFromResponse(response.data, "Order updated successfully.");
}

export async function deleteOrder(id: string) {
  const response = await api.delete(replacePathParam(endpoints.orders.delete, "id", id));

  return getMessageFromResponse(response.data, "Order deleted successfully.");
}

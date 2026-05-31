import endpoints from "@/config/endpoints";
import api from "@/lib/axios";
import { normalizeProduct } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function hasImageFiles(payload: Record<string, unknown>) {
  return Array.isArray(payload.images) && payload.images.some(isFile);
}

function toFormData(payload: Record<string, unknown>) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => {
        if (isFile(file)) {
          formData.append("images", file);
        }
      });
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

export async function getAllProducts() {
  const response = await api.get(endpoints.products.list);

  return getArrayFromResponse<unknown>(response.data, ["products"]).map((item, index) =>
    normalizeProduct(item, index)
  );
}

export async function createProduct(payload: Record<string, unknown>) {
  const response = hasImageFiles(payload)
    ? await api.post(endpoints.products.create, toFormData(payload), {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    : await api.post(endpoints.products.create, payload);

  return getMessageFromResponse(response.data, "Product created successfully.");
}

export async function updateProduct(id: string, payload: Record<string, unknown>) {
  const response = hasImageFiles(payload)
    ? await api.put(replacePathParam(endpoints.products.update, "id", id), toFormData(payload), {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    : await api.put(replacePathParam(endpoints.products.update, "id", id), payload);

  return getMessageFromResponse(response.data, "Product updated successfully.");
}

export async function deactivateProduct(id: string) {
  const response = await api.patch(replacePathParam(endpoints.products.deactivate, "id", id));

  return getMessageFromResponse(response.data, "Product deactivated successfully.");
}

export async function deleteProduct(id: string) {
  const response = await api.delete(replacePathParam(endpoints.products.delete, "id", id));

  return getMessageFromResponse(response.data, "Product deleted successfully.");
}

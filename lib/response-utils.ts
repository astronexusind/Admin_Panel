import axios from "axios";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapOnce(value: unknown) {
  if (!isRecord(value)) {
    return value;
  }

  for (const key of ["data", "result", "payload"]) {
    if (key in value && value[key] !== undefined) {
      return value[key];
    }
  }

  return value;
}

export function unwrapEnvelope<T = unknown>(value: unknown): T {
  let current = value;

  for (let index = 0; index < 2; index += 1) {
    const next = unwrapOnce(current);

    if (next === current) {
      break;
    }

    current = next;
  }

  return current as T;
}

export function getArrayFromResponse<T>(value: unknown, preferredKeys: string[] = []) {
  const payload = unwrapEnvelope<unknown>(value);

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!isRecord(payload)) {
    return [] as T[];
  }

  for (const key of [...preferredKeys, "items", "results", "rows"]) {
    const candidate = payload[key];

    if (Array.isArray(candidate)) {
      return candidate as T[];
    }

    if (isRecord(candidate)) {
      const nestedArray = Object.values(candidate).find(Array.isArray);

      if (nestedArray) {
        return nestedArray as T[];
      }
    }
  }

  const anyArray = Object.values(payload).find(Array.isArray);

  return (anyArray as T[]) ?? [];
}

export function getObjectFromResponse<T>(value: unknown, preferredKeys: string[] = []) {
  const payload = unwrapEnvelope<unknown>(value);

  if (isRecord(payload)) {
    return payload as T;
  }

  if (Array.isArray(payload)) {
    return null;
  }

  if (isRecord(value)) {
    for (const key of preferredKeys) {
      const candidate = value[key];

      if (isRecord(candidate)) {
        return candidate as T;
      }
    }
  }

  return null;
}

export function getString(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

export function getNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function getBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return fallback;
}

export function getMessageFromResponse(value: unknown, fallback = "Action completed successfully.") {
  const payload = getObjectFromResponse<UnknownRecord>(value, ["meta"]);

  return getString(payload?.message, fallback);
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const response = error.response?.data;
  const payload = getObjectFromResponse<UnknownRecord>(response);

  return (
    getString(payload?.message) ||
    getString(payload?.error) ||
    getString(payload?.detail) ||
    error.message ||
    fallback
  );
}

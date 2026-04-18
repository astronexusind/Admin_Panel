import type { AdminProfile } from "@/lib/types";

const TOKEN_KEY = "astronexus-admin-token";
const ADMIN_KEY = "astronexus-admin-profile";

function hasWindow() {
  return typeof window !== "undefined";
}

export function getStoredToken() {
  if (!hasWindow()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}

export function getStoredAdmin() {
  if (!hasWindow()) {
    return null;
  }

  const raw = window.localStorage.getItem(ADMIN_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminProfile;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin: AdminProfile | null) {
  if (!hasWindow()) {
    return;
  }

  if (!admin) {
    window.localStorage.removeItem(ADMIN_KEY);
    return;
  }

  window.localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearStoredAuth() {
  removeStoredToken();
  setStoredAdmin(null);
}

"use client";

import { create } from "zustand";

import { normalizeAdmin } from "@/lib/normalizers";
import { clearStoredAuth, getStoredAdmin, getStoredToken, setStoredAdmin, setStoredToken } from "@/lib/storage";
import type { AdminProfile } from "@/lib/types";

type SessionPayload = {
  token: string;
  admin: AdminProfile | null;
};

type AuthState = {
  token: string | null;
  admin: AdminProfile | null;
  hydrated: boolean;
  setSession: (session: SessionPayload) => void;
  clearSession: () => void;
  syncFromStorage: () => void;
  setAdmin: (admin: AdminProfile | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  admin: null,
  hydrated: false,
  setSession: ({ token, admin }) => {
    setStoredToken(token);
    setStoredAdmin(admin);
    set({
      token,
      admin: admin ? normalizeAdmin(admin) : null,
      hydrated: true
    });
  },
  clearSession: () => {
    clearStoredAuth();
    set({
      token: null,
      admin: null,
      hydrated: true
    });
  },
  syncFromStorage: () => {
    set({
      token: getStoredToken(),
      admin: getStoredAdmin(),
      hydrated: true
    });
  },
  setAdmin: (admin) => {
    setStoredAdmin(admin);
    set({
      admin,
      hydrated: true
    });
  }
}));

import type { ReactNode } from "react";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryId?: string;
  astrologyType: string;
  stock: number;
  description: string;
  images: string[];
  isActive: boolean;
  deliveryType: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  createdAt?: string | null;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  itemsCount: number;
  createdAt?: string | null;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string | null;
};

export type CmsContent = {
  id: string;
  type: string;
  title: string;
  content: string;
  image: string;
  isActive: boolean;
  updatedAt?: string | null;
};

export type Discount = {
  id: string;
  code: string;
  percentage: number;
  expiry: string;
  isActive: boolean;
};

export type Feedback = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string | null;
};

export type AstrologyService = {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  isPremium: boolean;
  updatedAt?: string | null;
};

export type DashboardStat = {
  label: string;
  value: number;
  helper: string;
  trend?: number;
};

export type DashboardOverview = {
  revenue: number;
  orders: number;
  users: number;
  products: number;
  activeDiscounts: number;
  pendingOrders: number;
};

export type DashboardTotals = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
};

export type DashboardRecentUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string | null;
};

export type DashboardRecentOrder = {
  id: string;
  userName: string;
  userEmail: string;
  status: string;
  total: number;
  itemsCount: number;
  createdAt?: string | null;
};

export type DashboardTopProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
  totalSold: number;
};

export type DashboardTopUser = {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
};

export type DashboardAdmin = {
  id: string;
  name: string;
  email: string;
  createdAt?: string | null;
};

export type DashboardData = {
  totals: DashboardTotals;
  recentUsers: DashboardRecentUser[];
  recentOrders: DashboardRecentOrder[];
  mostPurchasedProduct: DashboardTopProduct | null;
  topUser: DashboardTopUser | null;
  admins: DashboardAdmin[];
};

export type ChartPoint = {
  label: string;
  sales: number;
  orders: number;
};

export type PiePoint = {
  name: string;
  value: number;
};

export type Insight = {
  title: string;
  tone: "primary" | "accent" | "danger";
  description: string;
  value: string;
};

export type TableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

export type TableFilter<T> = {
  key: string;
  label: string;
  allLabel?: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  getValue: (row: T) => string;
};

export type FieldOption = {
  label: string;
  value: string;
};

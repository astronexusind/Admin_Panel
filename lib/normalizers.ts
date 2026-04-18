import type {
  AdminProfile,
  AstrologyService,
  Category,
  CmsContent,
  DashboardAdmin,
  DashboardData,
  DashboardOverview,
  DashboardRecentOrder,
  DashboardRecentUser,
  DashboardTopProduct,
  DashboardTopUser,
  Discount,
  Feedback,
  Order,
  Product,
  User
} from "@/lib/types";
import { getBoolean, getNumber, getObjectFromResponse, getString } from "@/lib/response-utils";

function getId(source: Record<string, unknown>, fallback: string) {
  return getString(source._id ?? source.id ?? source.uuid, fallback);
}

function getImageUrl(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  const source = getObjectFromResponse<Record<string, unknown>>(value);

  if (!source) {
    return "";
  }

  return getString(source.url ?? source.secure_url ?? source.path);
}

export function normalizeAdmin(raw: unknown, index = 0): AdminProfile {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};
  const email = getString(source.email, "admin@astronexus.ai");

  return {
    id: getId(source, `admin-${index}`),
    name: getString(source.name ?? source.fullName, email.split("@")[0]),
    email,
    role: getString(source.role, "Admin"),
    lastLogin: getString(source.lastLogin ?? source.updatedAt ?? source.createdAt) || null
  };
}

export function normalizeProduct(raw: unknown, index = 0): Product {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};
  const categorySource = getObjectFromResponse<Record<string, unknown>>(source.category);
  const images = Array.isArray(source.images)
    ? source.images.map(getImageUrl).filter((image) => image.length > 0)
    : [];
  const categoryName = getString(
    categorySource?.name ?? source.categoryName ?? source.category,
    "Uncategorized"
  );

  return {
    id: getId(source, `product-${index}`),
    name: getString(source.name, "Untitled Product"),
    price: getNumber(source.price),
    category: categoryName,
    categoryId: getString(categorySource?.id ?? categorySource?._id ?? source.categoryId ?? source.category),
    astrologyType: getString(source.astrologyType ?? source.type, "general"),
    stock: getNumber(source.stock ?? source.inventory),
    description: getString(source.description, "No description provided."),
    images,
    isActive: getBoolean(source.isActive, true),
    deliveryType: getString(source.deliveryType, "physical"),
    createdAt: getString(source.createdAt) || null,
    updatedAt: getString(source.updatedAt) || null
  };
}

export function normalizeUser(raw: unknown, index = 0): User {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};

  return {
    id: getId(source, `user-${index}`),
    name: getString(source.name, "Unknown User"),
    email: getString(source.email, "unknown@example.com"),
    phone: getString(source.phone, "N/A"),
    role: getString(source.role, "user"),
    isBlocked: getBoolean(source.isBlocked ?? source.blocked, false),
    createdAt: getString(source.createdAt) || null
  };
}

export function normalizeOrder(raw: unknown, index = 0): Order {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};
  const user = getObjectFromResponse<Record<string, unknown>>(source.user ?? source.customer);

  return {
    id: getId(source, `order-${index}`),
    customerName: getString(user?.name ?? source.customerName, "Guest"),
    customerEmail: getString(user?.email ?? source.customerEmail, "N/A"),
    total: getNumber(source.total ?? source.amount ?? source.grandTotal),
    status: getString(source.status, "Pending"),
    itemsCount: Array.isArray(source.items) ? source.items.length : getNumber(source.itemsCount, 0),
    createdAt: getString(source.createdAt) || null
  };
}

export function normalizeCategory(raw: unknown, index = 0): Category {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};

  return {
    id: getId(source, `category-${index}`),
    name: getString(source.name, "Untitled Category"),
    description: getString(source.description, "No description added."),
    isActive: getBoolean(source.isActive, true),
    createdAt: getString(source.createdAt) || null
  };
}

export function normalizeCmsContent(raw: unknown, index = 0): CmsContent {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};

  return {
    id: getId(source, `cms-${index}`),
    type: getString(source.type, "banner"),
    title: getString(source.title, "Untitled content"),
    content: getString(source.content, ""),
    image: getString(source.image, ""),
    isActive: getBoolean(source.isActive, true),
    updatedAt: getString(source.updatedAt ?? source.createdAt) || null
  };
}

export function normalizeDiscount(raw: unknown, index = 0): Discount {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};

  return {
    id: getId(source, `discount-${index}`),
    code: getString(source.code, "OFFER"),
    percentage: getNumber(source.percentage ?? source.discount),
    expiry: getString(source.expiry ?? source.expiresAt, ""),
    isActive: getBoolean(source.isActive, true)
  };
}

export function normalizeFeedback(raw: unknown, index = 0): Feedback {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};
  const user = getObjectFromResponse<Record<string, unknown>>(source.user);

  return {
    id: getId(source, `feedback-${index}`),
    name: getString(source.name ?? user?.name, "Anonymous"),
    email: getString(source.email ?? user?.email, "N/A"),
    message: getString(source.message ?? source.comment ?? source.feedback, ""),
    createdAt: getString(source.createdAt) || null
  };
}

export function normalizeAstrologyService(raw: unknown, index = 0): AstrologyService {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};

  return {
    id: getId(source, `astrology-service-${index}`),
    name: getString(source.name, "Untitled Service"),
    key: getString(source.key, "service"),
    description: getString(source.description, "No description provided."),
    enabled: getBoolean(source.enabled, true),
    isPremium: getBoolean(source.isPremium, false),
    updatedAt: getString(source.updatedAt ?? source.createdAt) || null
  };
}

export function normalizeDashboardOverview(raw: unknown): DashboardOverview {
  const source = getObjectFromResponse<Record<string, unknown>>(raw, ["overview", "stats"]) ?? {};

  return {
    revenue: getNumber(source.revenue ?? source.totalRevenue ?? source.sales),
    orders: getNumber(source.orders ?? source.totalOrders),
    users: getNumber(source.users ?? source.totalUsers),
    products: getNumber(source.products ?? source.totalProducts),
    activeDiscounts: getNumber(source.activeDiscounts ?? source.discounts),
    pendingOrders: getNumber(source.pendingOrders)
  };
}

function normalizeDashboardRecentUser(raw: unknown, index = 0): DashboardRecentUser {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};

  return {
    id: getId(source, `recent-user-${index}`),
    name: getString(source.name, "Unknown User"),
    email: getString(source.email, "N/A"),
    createdAt: getString(source.createdAt) || null
  };
}

function normalizeDashboardRecentOrder(raw: unknown, index = 0): DashboardRecentOrder {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};
  const user = getObjectFromResponse<Record<string, unknown>>(source.user);
  const items = Array.isArray(source.items) ? source.items : [];
  const total = items.reduce((sum, item) => {
    const row = getObjectFromResponse<Record<string, unknown>>(item) ?? {};
    const price = getNumber(row.price);
    const quantity = getNumber(row.quantity, 1);

    return sum + price * quantity;
  }, 0);

  return {
    id: getId(source, `recent-order-${index}`),
    userName: getString(user?.name, "Guest"),
    userEmail: getString(user?.email, "N/A"),
    status: getString(source.status, "Pending"),
    total,
    itemsCount: items.length,
    createdAt: getString(source.createdAt) || null
  };
}

function normalizeDashboardTopProduct(raw: unknown): DashboardTopProduct | null {
  const source = getObjectFromResponse<Record<string, unknown>>(raw);

  if (!source) {
    return null;
  }

  const images = Array.isArray(source.images)
    ? source.images.map(getImageUrl).filter((image) => image.length > 0)
    : [];

  return {
    id: getId(source, "top-product"),
    name: getString(source.name, "Untitled Product"),
    price: getNumber(source.price),
    images,
    totalSold: getNumber(source.totalSold)
  };
}

function normalizeDashboardTopUser(raw: unknown): DashboardTopUser | null {
  const source = getObjectFromResponse<Record<string, unknown>>(raw);

  if (!source) {
    return null;
  }

  return {
    id: getId(source, "top-user"),
    name: getString(source.name, "Unknown User"),
    email: getString(source.email, "N/A"),
    totalSpent: getNumber(source.totalSpent)
  };
}

function normalizeDashboardAdmin(raw: unknown, index = 0): DashboardAdmin {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};

  return {
    id: getId(source, `admin-${index}`),
    name: getString(source.name, "Admin"),
    email: getString(source.email, "N/A"),
    createdAt: getString(source.createdAt) || null
  };
}

export function normalizeDashboardData(raw: unknown): DashboardData {
  const source = getObjectFromResponse<Record<string, unknown>>(raw) ?? {};
  const totalsSource = getObjectFromResponse<Record<string, unknown>>(source.totals) ?? {};

  const recentUsers = Array.isArray(source.recentUsers)
    ? source.recentUsers.map((item, index) => normalizeDashboardRecentUser(item, index))
    : [];

  const recentOrders = Array.isArray(source.recentOrders)
    ? source.recentOrders.map((item, index) => normalizeDashboardRecentOrder(item, index))
    : [];

  const admins = Array.isArray(source.admins)
    ? source.admins.map((item, index) => normalizeDashboardAdmin(item, index))
    : [];

  return {
    totals: {
      totalUsers: getNumber(totalsSource.totalUsers),
      totalProducts: getNumber(totalsSource.totalProducts),
      totalOrders: getNumber(totalsSource.totalOrders),
      totalRevenue: getNumber(totalsSource.totalRevenue)
    },
    recentUsers,
    recentOrders,
    mostPurchasedProduct: normalizeDashboardTopProduct(source.mostPurchasedProduct),
    topUser: normalizeDashboardTopUser(source.topUser),
    admins
  };
}

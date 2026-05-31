const endpoints = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://backend.astronexus.in",
  auth: {
    login: "/api/admin/auth/login",
    all: "/api/admin/auth/all",
    updatePassword: "/api/admin/auth/update-password",
    logout: "/api/admin/auth/logout"
  },
  dashboard: {
    overview: "/api/admin/dashboard"
  },
  products: {
    list: "/api/admin/products",
    create: "/api/admin/products",
    update: "/api/admin/products/:id",
    delete: "/api/admin/products/:id",
    deactivate: "/api/admin/products/:id/deactivate"
  },
  users: {
    list: "/api/admin/users",
    create: "/api/admin/users",
    createAstrology: "/api/admin/users/astrology",
    block: "/api/admin/users/:id/block",
    delete: "/api/admin/users/:id"
  },
  orders: {
    list: "/api/admin/orders/all",
    updateStatus: "/api/admin/orders/:id/status",
    delete: "/api/admin/orders/:id"
  },
  categories: {
    list: "/api/admin/categories",
    create: "/api/admin/categories",
    update: "/api/admin/categories/:id",
    toggle: "/api/admin/categories/:id/toggle",
    delete: "/api/admin/categories/:id"
  },
  cms: {
    list: "/api/admin/cms",
    create: "/api/admin/cms",
    update: "/api/admin/cms/:id"
  },
  discounts: {
    list: "/api/discount",
    create: "/api/discount",
    update: "/api/discount/:discountId"
  },
  feedback: {
    list: "/api/feedback",
    delete: "/api/feedback/:feedbackId"
  },
  astrologyServices: {
    list: "/api/admin/astrology-services",
    create: "/api/admin/astrology-services",
    getById: "/api/admin/astrology-services/:id",
    update: "/api/admin/astrology-services/:id",
    delete: "/api/admin/astrology-services/:id",
    toggle: "/api/admin/astrology-services/:id/toggle"
  }
} as const;

export default endpoints;
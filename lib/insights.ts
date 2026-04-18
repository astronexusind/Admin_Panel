import type { ChartPoint, Discount, Insight, Order, PiePoint, Product, User } from "@/lib/types";

export function buildInsights(products: Product[], orders: Order[], discounts: Discount[]): Insight[] {
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5);
  const pendingOrders = orders.filter((order) => order.status.toLowerCase().includes("pending"));
  const expiredDiscounts = discounts.filter((discount) => {
    if (!discount.expiry) {
      return false;
    }

    return new Date(discount.expiry).getTime() < Date.now();
  });

  return [
    {
      title: "Low Stock Alerts",
      tone: lowStock.length > 0 ? "danger" : "primary",
      value: `${lowStock.length} items`,
      description:
        lowStock.length > 0
          ? `${lowStock
              .slice(0, 3)
              .map((product) => product.name)
              .join(", ")} need replenishment soon.`
          : "Inventory health looks stable across your current catalog."
    },
    {
      title: "Sales Trend Pulse",
      tone: pendingOrders.length > 10 ? "accent" : "primary",
      value: `${orders.length} orders`,
      description:
        pendingOrders.length > 10
          ? "Pending volume is climbing. Review fulfillment timelines to protect delivery SLAs."
          : "Order flow is steady. Current fulfillment volume appears manageable."
    },
    {
      title: "Suggested Action",
      tone: expiredDiscounts.length > 0 ? "accent" : "primary",
      value: expiredDiscounts.length > 0 ? `${expiredDiscounts.length} promos` : "Ready",
      description:
        expiredDiscounts.length > 0
          ? "Refresh or replace expired offers to keep conversion intent high on seasonal products."
          : "Consider pairing best-selling astrology products with a limited-time cross-sell discount."
    }
  ];
}

export function buildSalesSeries(orders: Order[]): ChartPoint[] {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const buckets = new Map<string, ChartPoint>();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    const label = formatter.format(date);

    buckets.set(label, {
      label,
      sales: 0,
      orders: 0
    });
  }

  orders.forEach((order) => {
    if (!order.createdAt) {
      return;
    }

    const date = new Date(order.createdAt);
    const label = formatter.format(date);
    const bucket = buckets.get(label);

    if (!bucket) {
      return;
    }

    bucket.sales += order.total;
    bucket.orders += 1;
  });

  return Array.from(buckets.values());
}

export function buildOrderStatusSeries(orders: Order[]): PiePoint[] {
  const counts = new Map<string, number>();

  orders.forEach((order) => {
    const status = order.status || "Unknown";
    counts.set(status, (counts.get(status) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function buildTopMetrics(
  revenue: number,
  orders: Order[],
  users: User[],
  products: Product[],
  discounts: Discount[]
) {
  const pendingOrders = orders.filter((order) => order.status.toLowerCase().includes("pending")).length;
  const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 5).length;

  return [
    {
      label: "Revenue Orbit",
      value: revenue,
      helper: `${orders.length} orders processed`,
      trend: 12.4
    },
    {
      label: "Community Growth",
      value: users.length,
      helper: "Active registered users",
      trend: 8.1
    },
    {
      label: "Catalog Depth",
      value: products.length,
      helper: `${lowStockCount} low-stock alerts`,
      trend: 4.6
    },
    {
      label: "Promo Signals",
      value: discounts.filter((discount) => discount.isActive).length,
      helper: `${pendingOrders} orders awaiting action`,
      trend: -1.8
    }
  ];
}

"use client";

import { Crown, PackageSearch, RefreshCw, ShoppingBag, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { OrderStatusChart } from "@/components/dashboard/order-status-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { getApiErrorMessage } from "@/lib/response-utils";
import type { DashboardData } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const emptyDashboard: DashboardData = {
  totals: {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  },
  recentUsers: [],
  recentOrders: [],
  mostPurchasedProduct: null,
  topUser: null,
  admins: []
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setDashboard(await getDashboardOverview());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load dashboard overview."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const pendingOrders = useMemo(
    () => dashboard.recentOrders.filter((order) => order.status.toLowerCase().includes("pending")).length,
    [dashboard.recentOrders]
  );

  const revenueChartData = useMemo(() => {
    const ordered = [...dashboard.recentOrders].sort(
      (left, right) => new Date(left.createdAt ?? 0).getTime() - new Date(right.createdAt ?? 0).getTime()
    );

    if (ordered.length === 0) {
      return [{ label: "No data", sales: 0, orders: 0 }];
    }

    return ordered.map((order, index) => ({
      label: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : `Order ${index + 1}`,
      sales: order.total,
      orders: 1
    }));
  }, [dashboard.recentOrders]);

  const orderStatusData = useMemo(() => {
    const counts = new Map<string, number>();

    dashboard.recentOrders.forEach((order) => {
      counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
    });

    if (counts.size === 0) {
      return [{ name: "No orders", value: 1 }];
    }

    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [dashboard.recentOrders]);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Overview"
        title="Dashboard"
        description="Live revenue, orders, products, and activity at a glance."
        actions={
          <Button variant="outline" onClick={() => void loadDashboard()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-[160px] rounded-[32px]" />
      ) : (
        <SummaryCards
          items={[
            {
              label: "Revenue",
              value: formatCurrency(dashboard.totals.totalRevenue),
              helper: "Delivered and completed orders.",
              icon: ShoppingBag,
              tone: "primary"
            },
            {
              label: "Orders",
              value: `${dashboard.totals.totalOrders}`,
              helper: `${pendingOrders} pending in the queue.`,
              icon: ShoppingBag,
              tone: "accent"
            },
            {
              label: "Users",
              value: `${dashboard.totals.totalUsers}`,
              helper: `${dashboard.admins.length} admin accounts.`,
              icon: UsersRound,
              tone: "success"
            },
            {
              label: "Products",
              value: `${dashboard.totals.totalProducts}`,
              helper: "Catalog count from products collection.",
              icon: PackageSearch,
              tone: "neutral"
            }
          ]}
        />
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Product</CardTitle>
            <CardDescription>Best-selling product in the current data set.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-28 rounded-3xl" />
            ) : !dashboard.mostPurchasedProduct ? (
              <p className="text-sm text-slate-400">No product sales data available.</p>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-card">
                  {dashboard.mostPurchasedProduct.images[0] ? (
                    <img
                      src={dashboard.mostPurchasedProduct.images[0]}
                      alt={dashboard.mostPurchasedProduct.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-white">{dashboard.mostPurchasedProduct.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{formatCurrency(dashboard.mostPurchasedProduct.price)}</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="success">Sold: {dashboard.mostPurchasedProduct.totalSold}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customer</CardTitle>
            <CardDescription>Highest spender across order history.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-28 rounded-3xl" />
            ) : !dashboard.topUser ? (
              <p className="text-sm text-slate-400">No user spending data available.</p>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <Avatar
                  name={dashboard.topUser.name}
                  src={
                    (dashboard.topUser as any)?.avatarUrl || (dashboard.topUser as any)?.image || (dashboard.topUser as any)?.profileImage || null
                  }
                  className="h-10 w-10 flex-shrink-0 rounded-lg text-xs"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-white">{dashboard.topUser.name}</p>
                  <p className="truncate text-sm text-slate-400">{dashboard.topUser.email}</p>
                  <p className="mt-1 text-xs text-slate-500">Highest spender in the current data set.</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="accent" className="text-sm">Spent: {formatCurrency(dashboard.topUser.totalSpent)}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
            <CardDescription>Latest admin records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-14 rounded-2xl" />)
            ) : dashboard.admins.length === 0 ? (
              <p className="text-sm text-slate-400">No admin users found.</p>
            ) : (
              dashboard.admins.slice(0, 3).map((admin) => (
                <div key={admin.id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={admin.name}
                      src={(admin as any)?.avatarUrl || (admin as any)?.image || null}
                      className="h-9 w-9 rounded-xl text-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <p className="font-medium text-white">{admin.name}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{admin.email}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-[420px] rounded-2xl" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Sales over time</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart data={revenueChartData} />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {loading ? (
            <Skeleton className="h-[420px] rounded-2xl" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Distribution of recent order states</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderStatusChart data={orderStatusData} />
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from the dashboard response.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-3xl" />)
            ) : dashboard.recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400">No recent orders found.</p>
            ) : (
              dashboard.recentOrders.map((order) => {
                const shortId = order.id.slice(-6).toUpperCase();
                const delivered = order.status.toLowerCase().includes("deliver") || order.status.toLowerCase().includes("complete");

                return (
                  <div
                    key={order.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 px-4 py-3 shadow-[0_10px_30px_rgba(2,8,23,0.35)] transition hover:border-white/20"
                  >
                    <div className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-white/20" />
                    <div className="ml-2 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-slate-300" />
                          <p className="font-semibold text-white">{order.userName}</p>
                          <Badge variant="neutral" className="text-[10px] tracking-[0.08em]">
                            #{shortId}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">{order.userEmail}</p>
                        <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                      </div>

                      <div className="space-y-2 text-right">
                        <Badge variant={delivered ? "success" : "neutral"}>{order.status}</Badge>
                        <p className="text-lg font-semibold text-white">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-slate-500">{order.itemsCount} items</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Newest user accounts from the dashboard response.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-16 rounded-3xl" />)
            ) : dashboard.recentUsers.length === 0 ? (
              <p className="text-sm text-slate-400">No recent users found.</p>
            ) : (
              dashboard.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          name={user.name}
                          src={(user as any)?.avatarUrl || (user as any)?.image || (user as any)?.profileImage || null}
                          className="h-10 w-10 flex-shrink-0 rounded-xl text-xs"
                        />
                        <div className="space-y-1 min-w-0">
                          <p className="truncate font-medium text-white">{user.name}</p>
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Badge variant="neutral" className="text-xs whitespace-nowrap">{formatDate(user.createdAt)}</Badge>
                      </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Ranked performance highlights from live dashboard data.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-amber-300/10 bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-300" />
                <p className="text-sm text-slate-200">Top Product</p>
              </div>
              <Badge variant="accent">#1</Badge>
            </div>
            <p className="mt-3 text-base font-semibold text-white">{dashboard.mostPurchasedProduct?.name ?? "N/A"}</p>
            <p className="mt-1 text-xs text-slate-400">
              Sold: {dashboard.mostPurchasedProduct?.totalSold ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-primary/10 bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersRound className="h-4 w-4 text-primary" />
                <p className="text-sm text-slate-200">Top User</p>
              </div>
              <Badge variant="neutral">#2</Badge>
            </div>
            <p className="mt-3 text-base font-semibold text-white">{dashboard.topUser?.name ?? "N/A"}</p>
            <p className="mt-1 text-xs text-slate-400">
              Spend: {formatCurrency(dashboard.topUser?.totalSpent ?? 0)}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-300/10 bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <p className="text-sm text-slate-200">Admins</p>
              </div>
              <Badge variant="success">#3</Badge>
            </div>
            <p className="mt-3 text-base font-semibold text-white">{dashboard.admins.length}</p>
            <p className="mt-1 text-xs text-slate-400">Total active admin accounts in the system.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

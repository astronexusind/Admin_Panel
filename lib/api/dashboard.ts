import endpoints from "@/config/endpoints.json";
import api from "@/lib/axios";
import { normalizeDashboardData } from "@/lib/normalizers";

export async function getDashboardOverview() {
  const response = await api.get(endpoints.dashboard.overview);

  return normalizeDashboardData(response.data);
}

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAdminStats(branchId?: string) {
  const url = branchId ? `/api/admin/stats?branch_id=${branchId}` : "/api/admin/stats"

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    stats: data?.stats,
    recentAppointments: data?.recentAppointments,
    revenueByMonth: data?.revenueByMonth,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

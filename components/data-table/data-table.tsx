"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { TableColumn, TableFilter } from "@/lib/types";

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase();
  }

  return JSON.stringify(value).toLowerCase();
}

export function DataTable<T>({
  title,
  description,
  data,
  columns,
  searchKeys = [],
  filters = [],
  loading,
  primaryAction,
  renderRowActions,
  emptyTitle,
  emptyDescription
}: {
  title: string;
  description: string;
  data: T[];
  columns: TableColumn<T>[];
  searchKeys?: string[];
  filters?: TableFilter<T>[];
  loading?: boolean;
  primaryAction?: React.ReactNode;
  renderRowActions?: (row: T) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterState, setFilterState] = useState<Record<string, string>>({});

  useEffect(() => {
    setPage(1);
  }, [search, filterState, pageSize, data.length]);

  const filteredData = data.filter((row) => {
    const matchesSearch =
      search.trim().length === 0 ||
      searchKeys.some((key) => stringifyValue((row as Record<string, unknown>)[key]).includes(search.toLowerCase()));

    const matchesFilters = filters.every((filter) => {
      const selected = filterState[filter.key];

      if (!selected || selected === "all") {
        return true;
      }

      return filter.getValue(row) === selected;
    });

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card>
      <CardHeader className="gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {primaryAction}
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative md:max-w-sm md:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search records..."
                className="pl-10"
              />
            </div>
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filterState[filter.key] ?? "all"}
                onChange={(event) =>
                  setFilterState((current) => ({
                    ...current,
                    [filter.key]: event.target.value
                  }))
                }
                className="md:max-w-[220px]"
              >
                <option value="all">{filter.allLabel ?? `All ${filter.label}`}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="neutral">{filteredData.length} results</Badge>
            <Select value={String(pageSize)} onChange={(event) => setPageSize(Number(event.target.value))} className="w-[120px]">
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {!loading && filteredData.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={emptyTitle ?? "No records found"}
              description={
                emptyDescription ?? "Try adjusting filters, refining search, or adding a new entry."
              }
              action={primaryAction}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr className="text-left">
                    {columns.map((column) => (
                      <th key={column.key} className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {column.header}
                      </th>
                    ))}
                    {renderRowActions ? (
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Actions
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading
                    ? Array.from({ length: 6 }).map((_, rowIndex) => (
                        <tr key={`skeleton-${rowIndex}`}>
                          {columns.map((column) => (
                            <td key={column.key} className="px-6 py-4">
                              <Skeleton className="h-5 w-full max-w-[180px]" />
                            </td>
                          ))}
                          {renderRowActions ? (
                            <td className="px-6 py-4">
                              <div className="ml-auto max-w-[150px]">
                                <Skeleton className="h-9 w-full" />
                              </div>
                            </td>
                          ) : null}
                        </tr>
                      ))
                    : paginated.map((row, index) => (
                        <tr key={`row-${index}`} className="transition-colors hover:bg-white/[0.03]">
                          {columns.map((column) => (
                            <td key={column.key} className="px-6 py-4 align-top text-sm text-slate-200">
                              {column.render(row)}
                            </td>
                          ))}
                          {renderRowActions ? (
                            <td className="px-6 py-4 align-top">
                              <div className="flex justify-end gap-2">{renderRowActions(row)}</div>
                            </td>
                          ) : null}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Badge variant="neutral">
                  Page {currentPage} / {totalPages}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

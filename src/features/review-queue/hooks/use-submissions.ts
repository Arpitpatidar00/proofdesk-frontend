"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions, fetchSubmissionById } from "@/lib/api/submissions";
import type { SubmissionFilter, SortOption } from "@/types";

export function useSubmissions(params: {
  filter: SubmissionFilter;
  sort: SortOption;
  page: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["submissions", params.filter, params.sort, params.page, params.limit],
    queryFn: () =>
      fetchSubmissions({
        filter: params.filter,
        sort: params.sort,
        page: params.page,
        limit: params.limit || 50,
      }),
    placeholderData: (prev) => prev,
  });
}

export function useSubmission(id: string | null) {
  return useQuery({
    queryKey: ["submission", id],
    queryFn: () => fetchSubmissionById(id!),
    enabled: !!id,
  });
}

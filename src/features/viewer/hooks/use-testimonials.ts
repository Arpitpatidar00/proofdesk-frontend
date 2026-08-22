"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/lib/api/submissions";
import type { SubmissionFilter, SortOption } from "@/types";

export function useTestimonials(params: {
  filter: SubmissionFilter;
  sort: SortOption;
  page: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [
      "testimonials",
      params.filter,
      params.sort,
      params.page,
      params.limit,
    ],
    queryFn: () =>
      fetchTestimonials({
        filter: params.filter,
        sort: params.sort,
        page: params.page,
        limit: params.limit || 50,
      }),
    placeholderData: (prev) => prev,
  });
}

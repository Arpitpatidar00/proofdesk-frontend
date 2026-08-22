import { apiClient } from "./client";
import type {
  ApiResponse,
  Submission,
  SubmissionFilter,
  BulkActionResult,
  BulkAction,
  SortOption,
} from "@/types";

// ─── Submissions API ───────────────────────────────────

export async function fetchSubmissions(params: {
  filter?: SubmissionFilter;
  sort?: SortOption;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Submission[]>> {
  const queryParams: Record<string, string> = {};

  if (params.filter?.search) queryParams.search = params.filter.search;
  if (params.filter?.status) queryParams.status = params.filter.status;
  if (params.filter?.type) queryParams.type = params.filter.type;
  if (params.filter?.ratingMin) queryParams.ratingMin = String(params.filter.ratingMin);
  if (params.filter?.ratingMax) queryParams.ratingMax = String(params.filter.ratingMax);
  if (params.filter?.from) queryParams.from = params.filter.from.toISOString();
  if (params.filter?.to) queryParams.to = params.filter.to.toISOString();
  if (params.sort) queryParams.sort = params.sort;
  if (params.page) queryParams.page = String(params.page);
  if (params.limit) queryParams.limit = String(params.limit);

  const { data } = await apiClient.get("/submissions", { params: queryParams });
  return data;
}

export async function fetchSubmissionById(id: string): Promise<ApiResponse<Submission>> {
  const { data } = await apiClient.get(`/submissions/${id}`);
  return data;
}

export async function createSubmission(input: {
  customerName: string;
  customerEmail: string;
  company: string;
  jobTitle: string;
  rating: number;
  testimonialText: string;
  testimonialType: string;
  sourceUrl?: string;
}): Promise<ApiResponse<Submission>> {
  const { data } = await apiClient.post("/submissions", input);
  return data;
}

export async function reviewSubmission(
  id: string,
  action: BulkAction
): Promise<ApiResponse<Submission>> {
  const { data } = await apiClient.patch(`/submissions/${id}/action`, { action });
  return data;
}

export async function bulkAction(input: {
  action: BulkAction;
  ids?: string[];
  filter?: SubmissionFilter;
}): Promise<ApiResponse<BulkActionResult>> {
  const { data } = await apiClient.post("/submissions/bulk-action", input);
  return data;
}

export async function fetchSubmissionCount(
  filter: SubmissionFilter
): Promise<ApiResponse<{ total: number }>> {
  const queryParams: Record<string, string> = {};
  if (filter.search) queryParams.search = filter.search;
  if (filter.status) queryParams.status = filter.status;
  if (filter.type) queryParams.type = filter.type;
  if (filter.ratingMin) queryParams.ratingMin = String(filter.ratingMin);
  if (filter.ratingMax) queryParams.ratingMax = String(filter.ratingMax);
  if (filter.from) queryParams.from = filter.from.toISOString();
  if (filter.to) queryParams.to = filter.to.toISOString();

  const { data } = await apiClient.get("/submissions/count", { params: queryParams });
  return data;
}

// ─── Testimonials API (Viewer) ─────────────────────────

export async function fetchTestimonials(params: {
  filter?: SubmissionFilter;
  sort?: SortOption;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Submission[]>> {
  const queryParams: Record<string, string> = {};

  if (params.filter?.search) queryParams.search = params.filter.search;
  if (params.filter?.type) queryParams.type = params.filter.type;
  if (params.filter?.ratingMin) queryParams.ratingMin = String(params.filter.ratingMin);
  if (params.filter?.ratingMax) queryParams.ratingMax = String(params.filter.ratingMax);
  if (params.sort) queryParams.sort = params.sort;
  if (params.page) queryParams.page = String(params.page);
  if (params.limit) queryParams.limit = String(params.limit);

  const { data } = await apiClient.get("/testimonials", { params: queryParams });
  return data;
}

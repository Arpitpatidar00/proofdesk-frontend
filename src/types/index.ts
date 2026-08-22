// ─── Imports ───────────────────────────────────────────
import type { SubmissionFilter } from "../features/submissions/schemas";

// ─── Enums ─────────────────────────────────────────────

export const SUBMISSION_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type SubmissionStatus = keyof typeof SUBMISSION_STATUSES;

export const TESTIMONIAL_TYPES = {
  WRITTEN: "WRITTEN",
  VIDEO: "VIDEO",
  SOCIAL: "SOCIAL",
  REVIEW: "REVIEW",
} as const;
export type TestimonialType = keyof typeof TESTIMONIAL_TYPES;

export const BULK_ACTIONS = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
} as const;
export type BulkAction = keyof typeof BULK_ACTIONS;

export const EXTERNAL_TYPES: TestimonialType[] = [
  TESTIMONIAL_TYPES.VIDEO,
  TESTIMONIAL_TYPES.SOCIAL,
  TESTIMONIAL_TYPES.REVIEW,
];

// ─── Sorting ───────────────────────────────────────────

export const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  ratingHigh: { rating: -1 },
  ratingLow: { rating: 1 },
} as const;
export type SortOption = keyof typeof SORT_OPTIONS;

// ─── Shared Base Type ───────────────────────────────────

export interface BaseSubmission<TDate = Date> {
  customer: {
    name: string;
    email: string;
    company: string;
    jobTitle: string;
  };
  rating: number;
  testimonial: {
    text: string;
    type: TestimonialType;
    sourceUrl?: string;
  };
  status: SubmissionStatus;
  reviewedBy?: string;
  reviewedAt?: TDate;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface SubmissionDTO extends BaseSubmission<string> {
  _id: string;
}
export type Submission = SubmissionDTO;

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationInfo;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface BulkActionResult {
  affectedCount: number;
  notificationCount: number;
}

// ─── Selection Model ───────────────────────────────────

export type Selection =
  | { mode: "NONE" }
  | { mode: "VISIBLE"; ids: string[] }
  | { mode: "FILTER"; filter: SubmissionFilter; totalMatching: number };


// ─── User Types ────────────────────────────────────────

export const USER_ROLES = {
  REVIEWER: "REVIEWER",
  VIEWER: "VIEWER",
} as const;
export type UserRole = keyof typeof USER_ROLES;

export interface User {
  email: string;
  role: UserRole;
}

// Re-export SubmissionFilter for backwards compatibility
export type { SubmissionFilter };

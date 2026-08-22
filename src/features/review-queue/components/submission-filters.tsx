"use client";

import type { SubmissionFilter, SubmissionStatus, TestimonialType } from "@/types";
import { SUBMISSION_STATUSES, TESTIMONIAL_TYPES } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SubmissionFiltersProps {
  filter: SubmissionFilter;
  onChange: (filter: SubmissionFilter) => void;
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const TYPE_LABELS: Record<TestimonialType, string> = {
  WRITTEN: "Written",
  VIDEO: "Video",
  SOCIAL: "Social",
  REVIEW: "Review",
};

export function SubmissionFilters({ filter, onChange }: SubmissionFiltersProps) {
  const hasFilters = filter.status || filter.type || filter.ratingMin;

  const updateFilter = (updates: Partial<SubmissionFilter>) => {
    onChange({ ...filter, ...updates });
  };

  const clearFilters = () => {
    onChange({
      search: filter.search, // Preserve search
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status Filter */}
      <Select
        value={filter.status || "ALL"}
        onValueChange={(val) =>
          updateFilter({
            status: val === "ALL" ? undefined : (val as SubmissionStatus),
          })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {Object.values(SUBMISSION_STATUSES).map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={filter.type || "ALL"}
        onValueChange={(val) =>
          updateFilter({
            type: val === "ALL" ? undefined : (val as TestimonialType),
          })
        }
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          {Object.values(TESTIMONIAL_TYPES).map((type) => (
            <SelectItem key={type} value={type}>
              {TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Rating Filter */}
      <Select
        value={filter.ratingMin ? String(filter.ratingMin) : "ALL"}
        onValueChange={(val) =>
          updateFilter({
            ratingMin: val === "ALL" || !val ? undefined : parseInt(val as string),
          })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Min Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Ratings</SelectItem>
          {[5, 4, 3, 2, 1].map((r) => (
            <SelectItem key={r} value={String(r)}>
              {"★".repeat(r)}{"☆".repeat(5 - r)} {r}+
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  );
}

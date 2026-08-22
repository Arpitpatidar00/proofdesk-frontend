"use client";

import { useState, useCallback } from "react";
import { useTestimonials } from "@/features/viewer/hooks/use-testimonials";
import { SearchBar } from "@/features/review-queue/components/search-bar";
import { SortSelect } from "@/features/review-queue/components/sort-select";
import { PaginationBar } from "@/features/review-queue/components/pagination-bar";
import { SubmissionDetail } from "@/features/review-queue/components/submission-detail";
import { useSubmission } from "@/features/review-queue/hooks/use-submissions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ExternalLink, Quote } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { SubmissionFilter, SortOption, Submission, TestimonialType } from "@/types";
import { TESTIMONIAL_TYPES } from "@/types";

const TYPE_LABELS: Record<TestimonialType, string> = {
  WRITTEN: "Written",
  VIDEO: "Video",
  SOCIAL: "Social",
  REVIEW: "Review",
};

function TestimonialCard({
  submission,
  onClick,
}: {
  submission: Submission;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 mt-0.5 text-primary/30 shrink-0" />
          <div className="space-y-3 min-w-0">
            <p className="text-sm leading-relaxed line-clamp-3">
              {submission.testimonial.text}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3.5 w-3.5",
                      star <= submission.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <Badge variant="outline" className="text-xs">
                {submission.testimonial.type}
              </Badge>
              {submission.testimonial.sourceUrl && (
                <a
                  href={submission.testimonial.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  Source
                </a>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {submission.customer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {submission.customer.jobTitle},{" "}
                  {submission.customer.company}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(submission.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<SubmissionFilter>({});
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data: response, isLoading } = useTestimonials({
    filter,
    sort,
    page,
  });

  const { data: detailResponse, isLoading: isDetailLoading } =
    useSubmission(detailId);

  const handleSearchChange = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search: search || undefined }));
    setPage(1);
  }, []);

  const submissions = response?.data || [];
  const pagination = response?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-sm text-muted-foreground">
            Browse approved customer testimonials.
          </p>
        </div>

        {/* Search */}
        <SearchBar value={filter.search || ""} onChange={handleSearchChange} />

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filter.type || "ALL"}
            onValueChange={(val) => {
              setFilter((prev) => ({
                ...prev,
                type: val === "ALL" ? undefined : (val as TestimonialType),
              }));
              setPage(1);
            }}
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

          <Select
            value={filter.ratingMin ? String(filter.ratingMin) : "ALL"}
            onValueChange={(val) => {
              setFilter((prev) => ({
                ...prev,
                ratingMin: val === "ALL" || !val ? undefined : parseInt(val as string),
              }));
              setPage(1);
            }}
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

          <div className="ml-auto">
            <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No testimonials found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission) => (
              <TestimonialCard
                key={submission._id}
                submission={submission}
                onClick={() => setDetailId(submission._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <PaginationBar pagination={pagination} onPageChange={setPage} />
        )}

        {/* Detail Panel */}
        <SubmissionDetail
          submission={detailResponse?.data}
          isLoading={isDetailLoading}
          isOpen={!!detailId}
          onClose={() => setDetailId(null)}
          isReviewer={false}
        />
      </div>
    </div>
  );
}

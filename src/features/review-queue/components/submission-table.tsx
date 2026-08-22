"use client";

import type { Submission, SubmissionStatus, TestimonialType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SubmissionTableProps {
  submissions: Submission[];
  isLoading: boolean;
  isSelected: (id: string) => boolean;
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  allVisibleSelected: boolean;
  onRowClick: (id: string) => void;
}

const STATUS_VARIANT: Record<SubmissionStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const TYPE_VARIANT: Record<TestimonialType, string> = {
  WRITTEN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  VIDEO: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  SOCIAL: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  REVIEW: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/20"
          )}
        />
      ))}
    </div>
  );
}

export function SubmissionTable({
  submissions,
  isLoading,
  isSelected,
  onToggle,
  onSelectAll,
  allVisibleSelected,
  onRowClick,
}: SubmissionTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No submissions found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={allVisibleSelected && submissions.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectAll(submissions.map((s) => s._id));
                  } else {
                    onSelectAll([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow
              key={submission._id}
              className="cursor-pointer"
              onClick={() => onRowClick(submission._id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected(submission._id)}
                  onCheckedChange={() => onToggle(submission._id)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{submission.customer.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {submission.testimonial.text}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {submission.customer.company}
              </TableCell>
              <TableCell>
                <RatingStars rating={submission.rating} />
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={cn("text-xs font-medium", TYPE_VARIANT[submission.testimonial.type])}>
                  {submission.testimonial.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={cn("text-xs font-medium", STATUS_VARIANT[submission.status])}>
                  {submission.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {format(new Date(submission.createdAt), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

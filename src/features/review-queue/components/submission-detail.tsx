"use client";

import type { Submission, BulkAction } from "@/types";
import { SUBMISSION_STATUSES, BULK_ACTIONS } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  CheckCircle,
  XCircle,
  Mail,
  Building2,
  Briefcase,
  Calendar,
  ExternalLink,
  Loader2,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SubmissionDetailProps {
  submission: Submission | null | undefined;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: BulkAction) => void;
  isActionPending?: boolean;
  isReviewer?: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SubmissionDetail({
  submission,
  isLoading,
  isOpen,
  onClose,
  onAction,
  isActionPending,
  isReviewer,
}: SubmissionDetailProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 gap-0 border-l shadow-2xl">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b bg-muted/30 shrink-0">
          <SheetTitle className="text-xl font-bold tracking-tight">Submission Details</SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ) : submission ? (
            <div className="p-6 space-y-8">
              {/* Customer Info (Premium Profile Style) */}
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-xl font-bold text-primary-foreground shadow-inner">
                  {getInitials(submission.customer.name)}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold tracking-tight truncate">
                      {submission.customer.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                        submission.status === SUBMISSION_STATUSES.PENDING &&
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                        submission.status === SUBMISSION_STATUSES.APPROVED &&
                          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                        submission.status === SUBMISSION_STATUSES.REJECTED &&
                          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                      )}
                    >
                      {submission.status}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-2 text-sm text-muted-foreground pt-1">
                    <div className="flex items-center gap-2.5 group">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                      <span className="truncate">{submission.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 group">
                      <Building2 className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                      <span className="truncate">{submission.customer.company}</span>
                    </div>
                    <div className="flex items-center gap-2.5 group">
                      <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                      <span className="truncate">{submission.customer.jobTitle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating & Testimonial Section */}
              <div className="space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/20">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4 transition-colors",
                          star <= submission.rating
                            ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                            : "text-muted-foreground/20"
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {submission.testimonial.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="px-5 py-6 relative">
                  <Quote className="absolute top-4 left-4 h-12 w-12 text-primary/5 -z-10 rotate-180" />
                  <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap relative z-10 font-medium">
                    "{submission.testimonial.text}"
                  </p>
                  
                  {submission.testimonial.sourceUrl && (
                    <div className="mt-6">
                      <a
                        href={submission.testimonial.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Original Source
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="rounded-lg bg-muted/40 p-4 space-y-3 border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>Submitted {format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                </div>
                {submission.reviewedAt && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>Reviewed {format(new Date(submission.reviewedAt), "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                      {submission.reviewedBy && (
                        <span className="font-medium">by {submission.reviewedBy}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
              <p className="font-medium text-lg">Submission not found</p>
              <p className="text-sm mt-1">This record might have been deleted.</p>
            </div>
          )}
        </div>

        {/* Sticky Actions Footer (Reviewer only, PENDING only) */}
        {isReviewer && submission && submission.status === SUBMISSION_STATUSES.PENDING && onAction && (
          <div className="p-4 border-t bg-background/80 backdrop-blur-xl shrink-0 z-10 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-[0.98]"
                onClick={() => onAction(BULK_ACTIONS.APPROVE)}
                disabled={isActionPending}
                size="lg"
              >
                {isActionPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-5 w-5" />
                )}
                Approve
              </Button>
              <Button
                className="flex-1 shadow-sm transition-all active:scale-[0.98]"
                variant="destructive"
                onClick={() => onAction(BULK_ACTIONS.REJECT)}
                disabled={isActionPending}
                size="lg"
              >
                {isActionPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-5 w-5" />
                )}
                Reject
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

"use client";

import type { Selection, SubmissionFilter, BulkAction } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface BulkActionBarProps {
  selection: Selection;
  selectedCount: number;
  totalMatching: number;
  currentFilter: SubmissionFilter;
  onSelectAllMatching: (filter: SubmissionFilter, total: number) => void;
  onClearSelection: () => void;
  onBulkAction: (action: BulkAction) => void;
  isPending: boolean;
}

export function BulkActionBar({
  selection,
  selectedCount,
  totalMatching,
  currentFilter,
  onSelectAllMatching,
  onClearSelection,
  onBulkAction,
  isPending,
}: BulkActionBarProps) {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);

  if (selection.mode === "NONE") return null;

  const showSelectAll =
    selection.mode === "VISIBLE" && totalMatching > selectedCount;

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {selectedCount.toLocaleString()} selected
          </span>
          {selection.mode === "FILTER" && (
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              All matching
            </span>
          )}
          {showSelectAll && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() =>
                onSelectAllMatching(currentFilter, totalMatching)
              }
            >
              Select all {totalMatching.toLocaleString()} matching
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            disabled={isPending}
          >
            Clear
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setConfirmAction("APPROVE")}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            )}
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setConfirmAction("REJECT")}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
            )}
            Reject
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Bulk{" "}
              {confirmAction === "APPROVE" ? "Approval" : "Rejection"}
            </DialogTitle>
            <DialogDescription>
              You are about to{" "}
              <strong>
                {confirmAction === "APPROVE" ? "approve" : "reject"}{" "}
                {selectedCount.toLocaleString()}
              </strong>{" "}
              testimonial{selectedCount !== 1 ? "s" : ""}.
              {selection.mode === "FILTER" && (
                <span className="block mt-2 text-amber-600 dark:text-amber-400">
                  This will affect all records matching your current filter, not
                  just the visible page.
                </span>
              )}
              <span className="block mt-2">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmAction === "APPROVE" ? "default" : "destructive"
              }
              onClick={() => {
                if (confirmAction) {
                  onBulkAction(confirmAction);
                  setConfirmAction(null);
                }
              }}
              disabled={isPending}
              className={
                confirmAction === "APPROVE"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {isPending && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              {confirmAction === "APPROVE" ? "Approve" : "Reject"}{" "}
              {selectedCount.toLocaleString()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

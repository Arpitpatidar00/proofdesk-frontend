"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewSubmission, bulkAction } from "@/lib/api/submissions";
import type { BulkAction, Selection } from "@/types";
import { toast } from "sonner";

export function useSubmissionAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: BulkAction }) =>
      reviewSubmission(id, action),
    onSuccess: (_, variables) => {
      toast.success(
        `Submission ${variables.action === "APPROVE" ? "approved" : "rejected"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission", variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update submission");
    },
  });
}

export function useBulkAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      action,
      selection,
    }: {
      action: BulkAction;
      selection: Selection;
    }) => {
      if (selection.mode === "VISIBLE") {
        return bulkAction({ action, ids: selection.ids });
      }
      if (selection.mode === "FILTER") {
        return bulkAction({ action, filter: selection.filter });
      }
      throw new Error("No selection");
    },
    onSuccess: (data, variables) => {
      const count = data.data.affectedCount;
      const actionLabel =
        variables.action === "APPROVE" ? "approved" : "rejected";
      toast.success(
        `${count.toLocaleString()} testimonial${count !== 1 ? "s" : ""} ${actionLabel}`
      );
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Bulk operation failed");
    },
  });
}

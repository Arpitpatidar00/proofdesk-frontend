"use client";

import { useState, useCallback } from "react";
import type { Selection, SubmissionFilter } from "@/types";

export function useSelection() {
  const [selection, setSelection] = useState<Selection>({ mode: "NONE" });

  const selectNone = useCallback(() => {
    setSelection({ mode: "NONE" });
  }, []);

  const toggleVisible = useCallback((id: string) => {
    setSelection((prev) => {
      if (prev.mode === "FILTER") return prev; // Don't modify filter selection

      const currentIds = prev.mode === "VISIBLE" ? prev.ids : [];
      const exists = currentIds.includes(id);

      const newIds = exists
        ? currentIds.filter((i) => i !== id)
        : [...currentIds, id];

      return newIds.length === 0 ? { mode: "NONE" } : { mode: "VISIBLE", ids: newIds };
    });
  }, []);

  const selectAllVisible = useCallback((ids: string[]) => {
    setSelection(
      ids.length === 0 ? { mode: "NONE" } : { mode: "VISIBLE", ids }
    );
  }, []);

  const selectAllMatching = useCallback(
    (filter: SubmissionFilter, totalMatching: number) => {
      setSelection({ mode: "FILTER", filter, totalMatching });
    },
    []
  );

  const isSelected = useCallback(
    (id: string) => {
      if (selection.mode === "VISIBLE") return selection.ids.includes(id);
      if (selection.mode === "FILTER") return true; // All matching are selected
      return false;
    },
    [selection]
  );

  const selectedCount =
    selection.mode === "VISIBLE"
      ? selection.ids.length
      : selection.mode === "FILTER"
        ? selection.totalMatching
        : 0;

  return {
    selection,
    selectNone,
    toggleVisible,
    selectAllVisible,
    selectAllMatching,
    isSelected,
    selectedCount,
  };
}

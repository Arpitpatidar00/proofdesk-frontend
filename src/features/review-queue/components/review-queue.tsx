"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubmissions, useSubmission } from "../hooks/use-submissions";
import { useSelection } from "../hooks/use-selection";
import { useSubmissionAction, useBulkAction } from "../hooks/use-actions";
import { SearchBar } from "./search-bar";
import { SubmissionFilters } from "./submission-filters";
import { SortSelect } from "./sort-select";
import { SubmissionTable } from "./submission-table";
import { BulkActionBar } from "./bulk-action-bar";
import { SubmissionDetail } from "./submission-detail";
import { PaginationBar } from "./pagination-bar";
import type { SubmissionFilter, SortOption, BulkAction } from "@/types";

export function ReviewQueue() {
  const { isReviewer } = useAuth();

  // State
  const [filter, setFilter] = useState<SubmissionFilter>({});
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Selection
  const {
    selection,
    selectNone,
    toggleVisible,
    selectAllVisible,
    selectAllMatching,
    isSelected,
    selectedCount,
  } = useSelection();

  // Data
  const { data: response, isLoading } = useSubmissions({
    filter,
    sort,
    page,
  });

  const { data: detailResponse, isLoading: isDetailLoading } =
    useSubmission(detailId);

  // Mutations
  const singleAction = useSubmissionAction();
  const bulkActionMutation = useBulkAction();

  // Handlers
  const handleFilterChange = useCallback(
    (newFilter: SubmissionFilter) => {
      setFilter(newFilter);
      setPage(1);
      selectNone();
    },
    [selectNone]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilter((prev) => ({ ...prev, search: search || undefined }));
      setPage(1);
      selectNone();
    },
    [selectNone]
  );

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleBulkAction = useCallback(
    (action: BulkAction) => {
      bulkActionMutation.mutate(
        { action, selection },
        {
          onSuccess: () => {
            selectNone();
          },
        }
      );
    },
    [bulkActionMutation, selection, selectNone]
  );

  const handleSingleAction = useCallback(
    (action: BulkAction) => {
      if (!detailId) return;
      singleAction.mutate(
        { id: detailId, action },
        {
          onSuccess: () => {
            setDetailId(null);
          },
        }
      );
    },
    [detailId, singleAction]
  );

  const submissions = response?.data || [];
  const pagination = response?.pagination;

  const allVisibleSelected =
    submissions.length > 0 &&
    selection.mode === "VISIBLE" &&
    submissions.every((s) => selection.ids.includes(s._id));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Queue</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and moderate testimonial submissions.
        </p>
      </div>

      {/* Search */}
      <SearchBar value={filter.search || ""} onChange={handleSearchChange} />

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SubmissionFilters filter={filter} onChange={handleFilterChange} />
        <SortSelect value={sort} onChange={handleSortChange} />
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selection={selection}
        selectedCount={selectedCount}
        totalMatching={pagination?.total || 0}
        currentFilter={filter}
        onSelectAllMatching={selectAllMatching}
        onClearSelection={selectNone}
        onBulkAction={handleBulkAction}
        isPending={bulkActionMutation.isPending}
      />

      {/* Table */}
      <SubmissionTable
        submissions={submissions}
        isLoading={isLoading}
        isSelected={isSelected}
        onToggle={toggleVisible}
        onSelectAll={(ids) => {
          if (ids.length === 0) {
            selectNone();
          } else {
            selectAllVisible(ids);
          }
        }}
        allVisibleSelected={allVisibleSelected}
        onRowClick={setDetailId}
      />

      {/* Pagination */}
      {pagination && (
        <PaginationBar pagination={pagination} onPageChange={handlePageChange} />
      )}

      {/* Detail Panel */}
      <SubmissionDetail
        submission={detailResponse?.data}
        isLoading={isDetailLoading}
        isOpen={!!detailId}
        onClose={() => setDetailId(null)}
        onAction={handleSingleAction}
        isActionPending={singleAction.isPending}
        isReviewer={isReviewer}
      />
    </div>
  );
}

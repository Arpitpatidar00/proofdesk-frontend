"use client";

import { ReviewQueue } from "@/features/review-queue/components/review-queue";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewPage() {
  const { isReviewer } = useAuth();
  const router = useRouter();

  // Redirect viewers away from review page
  useEffect(() => {
    if (!isReviewer) {
      router.replace("/testimonials");
    }
  }, [isReviewer, router]);

  if (!isReviewer) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <ReviewQueue />
    </div>
  );
}

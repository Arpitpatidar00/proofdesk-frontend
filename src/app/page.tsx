"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isReviewer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(isReviewer ? "/review" : "/testimonials");
  }, [isReviewer, router]);

  return null;
}

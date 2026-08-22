"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createSubmission } from "@/lib/api/submissions";
import {
  submissionFormSchema,
  type SubmissionFormValues,
} from "@/features/submissions/schemas";
import { TESTIMONIAL_TYPES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Star, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  WRITTEN: "Written Testimonial",
  VIDEO: "Video Testimonial",
  SOCIAL: "Social Media Post",
  REVIEW: "Review Site",
};

const EXTERNAL_TYPES = ["VIDEO", "SOCIAL", "REVIEW"];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      company: "",
      jobTitle: "",
      rating: 0,
      testimonialText: "",
      testimonialType: "WRITTEN",
      sourceUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
    },
  });

  const watchType = form.watch("testimonialType");
  const watchRating = form.watch("rating");
  const showSourceUrl = EXTERNAL_TYPES.includes(watchType);

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold">Thank you!</h2>
            <p className="text-muted-foreground max-w-md">
              Your testimonial has been submitted successfully. Our team will
              review it shortly.
            </p>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="mt-4"
            >
              Submit Another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Share Your Experience
        </h1>
        <p className="mt-2 text-muted-foreground">
          We&apos;d love to hear about your experience. Your testimonial helps
          others make informed decisions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a Testimonial</CardTitle>
          <CardDescription>
            All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-5"
          >
            {/* Name & Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name *</Label>
                <Input
                  id="customerName"
                  placeholder="John Smith"
                  {...form.register("customerName")}
                />
                {form.formState.errors.customerName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customerName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="john@example.com"
                  {...form.register("customerEmail")}
                />
                {form.formState.errors.customerEmail && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customerEmail.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company & Job Title */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  {...form.register("company")}
                />
                {form.formState.errors.company && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.company.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Product Manager"
                  {...form.register("jobTitle")}
                />
                {form.formState.errors.jobTitle && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => form.setValue("rating", star, { shouldValidate: true })}
                    className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors",
                        star <= watchRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
              {form.formState.errors.rating && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.rating.message}
                </p>
              )}
            </div>

            {/* Testimonial Type */}
            <div className="space-y-2">
              <Label>Testimonial Type *</Label>
              <Select
                value={watchType}
                onValueChange={(val) =>
                  form.setValue(
                    "testimonialType",
                    val as SubmissionFormValues["testimonialType"],
                    { shouldValidate: true }
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TESTIMONIAL_TYPES).map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source URL (conditional) */}
            {showSourceUrl && (
              <div className="space-y-2">
                <Label htmlFor="sourceUrl">Source URL *</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  placeholder="https://..."
                  {...form.register("sourceUrl")}
                />
                {form.formState.errors.sourceUrl && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.sourceUrl.message}
                  </p>
                )}
              </div>
            )}

            {/* Testimonial Text */}
            <div className="space-y-2">
              <Label htmlFor="testimonialText">Your Testimonial *</Label>
              <Textarea
                id="testimonialText"
                rows={5}
                placeholder="Tell us about your experience..."
                className="resize-none"
                {...form.register("testimonialText")}
              />
              <div className="flex justify-between">
                {form.formState.errors.testimonialText ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.testimonialText.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground">
                  {form.watch("testimonialText")?.length || 0}/5000
                </span>
              </div>
            </div>

            {/* Error */}
            {mutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(mutation.error as Error).message ||
                    "Something went wrong. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
              size="lg"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Testimonial
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

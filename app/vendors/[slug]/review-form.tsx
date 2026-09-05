'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitReview } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

export function ReviewForm({ vendorId, vendorSlug }: { vendorId: string; vendorSlug?: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const reviewerName = (formData.get('reviewer_name') as string || '').trim();
    const text = (formData.get('review_text') as string || '').trim();
    const rating = parseInt(formData.get('rating') as string, 10);

    // Client-side validation
    if (!reviewerName) {
      setError("Please enter your name.");
      return;
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    if (text.length < 20) {
      setError("Review must be at least 20 characters.");
      return;
    }

    if (text.length > 200) {
      setError("Review must be less than 200 characters.");
      return;
    }

    // Rate limiting (60s)
    const lastSubmission = localStorage.getItem(`last_submission_${vendorId}`);
    if (lastSubmission) {
      const timeSinceLast = Date.now() - parseInt(lastSubmission, 10);
      if (timeSinceLast < 60000) {
        setError(`Please wait ${Math.ceil((60000 - timeSinceLast) / 1000)}s before submitting another review.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await submitReview(formData);
      localStorage.setItem(`last_submission_${vendorId}`, Date.now().toString());
      formRef.current?.reset();
      setReviewText("");
      setToastMessage("Review submitted!");
      setTimeout(() => setToastMessage(null), 4000);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-4 p-3.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form 
        ref={formRef}
        action={handleSubmit}
        className="space-y-4"
      >
        <input type="hidden" name="vendor_id" value={vendorId} />
        <input type="hidden" name="vendor_slug" value={vendorSlug || ''} />
        
        {error && (
          <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="reviewer_name">Your Name</Label>
          <Input 
            id="reviewer_name" 
            name="reviewer_name" 
            required 
            placeholder="John Doe" 
            className="bg-background border-border" 
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input 
            id="rating" 
            name="rating" 
            type="number" 
            min="1" 
            max="5" 
            required 
            defaultValue="5" 
            className="bg-background border-border" 
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="review_text">Review</Label>
            <span className={`text-xs tabular-nums font-mono ${
              reviewText.length > 200 
                ? 'text-red-400 font-bold' 
                : reviewText.length >= 20 
                  ? 'text-muted-foreground' 
                  : 'text-amber-400/80'
            }`}>
              {reviewText.length} / 200
            </span>
          </div>
          <Textarea 
            id="review_text" 
            name="review_text" 
            required 
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="What did you think of the food? (minimum 20 characters)" 
            className="bg-background border-border resize-none" 
            rows={3} 
            maxLength={200}
            disabled={isSubmitting}
          />
        </div>

        <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
}

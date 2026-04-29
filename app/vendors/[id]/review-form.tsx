'use client';

import { useRef, useState } from 'react';
import { submitReview } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ReviewForm({ vendorId }: { vendorId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const reviewerName = (formData.get('reviewer_name') as string || '').trim();
    const reviewText = (formData.get('review_text') as string || '').trim();
    const rating = parseInt(formData.get('rating') as string, 10);

    // Client-side validation
    if (!reviewerName || !reviewText || isNaN(rating) || rating < 1 || rating > 5) {
      setError("Please fill in all fields correctly.");
      return;
    }

    if (reviewText.length > 200) {
      setError("Review must be less than 200 characters.");
      return;
    }

    // Rate limiting
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
      alert("Review submitted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      ref={formRef}
      action={handleSubmit}
      className="space-y-4"
    >
      <input type="hidden" name="vendor_id" value={vendorId} />
      
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
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Max 200 chars</span>
        </div>
        <Textarea 
          id="review_text" 
          name="review_text" 
          required 
          placeholder="What did you think of the food?" 
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
  );
}


'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';

export async function submitReview(formData: FormData) {
  const vendor_id = formData.get('vendor_id') as string;
  const vendor_slug = formData.get('vendor_slug') as string;
  const reviewer_name = (formData.get('reviewer_name') as string || '').trim();
  const rating = parseInt(formData.get('rating') as string, 10);
  const review_text = (formData.get('review_text') as string || '').trim().slice(0, 200);

  if (!vendor_id || !reviewer_name || isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error('Invalid input data');
  }

  if (reviewer_name.length === 0) {
    throw new Error('Reviewer name cannot be empty');
  }

  if (review_text.length < 20 || review_text.length > 200) {
    throw new Error('Review must be between 20 and 200 characters.');
  }

  const { error } = await supabase
    .from('reviews')
    .insert([{ vendor_id, reviewer_name, rating, review_text }]);

  if (error) {
    console.error('Error submitting review:', error);
    throw new Error('Failed to submit review. Please try again later.');
  }

  if (vendor_slug) {
    revalidatePath(`/vendors/${vendor_slug}`);
  }
  revalidatePath(`/vendors/${vendor_id}`);
}


export async function addVendor(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = name ? slugify(name) : undefined;
  await supabase.from('vendors').insert({
    name,
    slug,
    description: formData.get('description'),
    cuisine_type: formData.get('cuisine_type'),
    location_in_court: formData.get('location_in_court'),
    image_url: formData.get('image_url'),
    is_open: formData.get('is_open') === 'on',
  })

  revalidatePath('/')
  revalidatePath('/vendors')
}

export async function addMenuItem(formData: FormData) {
  await supabase.from('menu_items').insert({
    vendor_id: formData.get('vendor_id'),
    name: formData.get('name'),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    is_veg: formData.get('is_veg') === 'on',
  })

  revalidatePath('/')
}

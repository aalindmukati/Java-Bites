import { unstable_noStore as noStore } from 'next/cache'
import { supabase } from './supabase'
import { slugify } from './utils'

export async function getVendors() {
  noStore()

  // First try with slug column
  const { data, error } = await supabase
    .from('vendors')
    .select('id, slug, name, description, cuisine_type, location_in_court, is_open, image_url, phone_number, menu_items(id, name, price, category, is_veg)')

  // If slug column does not exist yet in database, fall back to query without slug
  if (error && (error.code === '42703' || error.message?.includes('slug'))) {
    const fallback = await supabase
      .from('vendors')
      .select('id, name, description, cuisine_type, location_in_court, is_open, image_url, phone_number, menu_items(id, name, price, category, is_veg)')

    if (fallback.error) {
      console.error('Error fetching vendors:', fallback.error)
      return []
    }
    return (fallback.data ?? []).map(v => ({
      ...v,
      slug: (v as any).slug || slugify(v.name)
    }))
  }

  if (error) {
    console.error('Error fetching vendors:', error)
    return []
  }

  return (data ?? []).map(v => ({
    ...v,
    slug: v.slug || slugify(v.name)
  }))
}

export async function getVendorById(id: string) {
  noStore()

  const { data, error } = await supabase
    .from('vendors')
    .select('id, slug, name, description, cuisine_type, location_in_court, is_open, image_url, phone_number')
    .eq('id', id)
    .single()

  if (error && (error.code === '42703' || error.message?.includes('slug'))) {
    const fallback = await supabase
      .from('vendors')
      .select('id, name, description, cuisine_type, location_in_court, is_open, image_url, phone_number')
      .eq('id', id)
      .single()

    if (fallback.error) {
      console.error('Supabase error:', fallback.error)
      return null
    }
    return fallback.data ? {
      ...fallback.data,
      slug: (fallback.data as any).slug || slugify(fallback.data.name)
    } : null
  }

  if (error) {
    console.error('Supabase error:', error)
    return null
  }

  return data ? {
    ...data,
    slug: data.slug || slugify(data.name)
  } : null
}

export async function getVendorBySlug(slug: string) {
  noStore()

  const { data, error } = await supabase
    .from('vendors')
    .select('id, slug, name, description, cuisine_type, location_in_court, is_open, image_url, phone_number')
    .eq('slug', slug)
    .single()

  // If slug column does not exist yet, find in vendors list
  if (error && (error.code === '42703' || error.message?.includes('slug'))) {
    const all = await getVendors()
    const found = all.find(v => v.slug === slug || slugify(v.name) === slug)
    return found ? {
      id: found.id,
      slug: found.slug,
      name: found.name,
      description: found.description,
      cuisine_type: found.cuisine_type,
      location_in_court: found.location_in_court,
      is_open: found.is_open,
      image_url: found.image_url,
      phone_number: (found as any).phone_number
    } : null
  }

  if (error) {
    // If not found by exact slug, check if vendor has an alias or matches slugify(name)
    const all = await getVendors()
    const found = all.find(v => v.slug === slug || slugify(v.name) === slug)
    if (found) {
      return {
        id: found.id,
        slug: found.slug,
        name: found.name,
        description: found.description,
        cuisine_type: found.cuisine_type,
        location_in_court: found.location_in_court,
        is_open: found.is_open,
        image_url: found.image_url,
        phone_number: (found as any).phone_number
      }
    }
    console.error('Supabase error fetching vendor by slug:', error)
    return null
  }

  return data
}

export async function getMenuItems(vendorId: string) {
  noStore()

  const { data, error } = await supabase
    .from('menu_items')
    .select('id, vendor_id, name, price, category, is_veg')
    .eq('vendor_id', vendorId)
    .order('category')

  if (error) {
    console.error('Supabase error:', error)
    return []
  }

  return data ?? []
}

export async function getReviews(vendorId: string) {
  noStore()

  const { data, error } = await supabase
    .from('reviews')
    .select('id, vendor_id, reviewer_name, rating, review_text, created_at')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    return []
  }

  return data ?? []
}

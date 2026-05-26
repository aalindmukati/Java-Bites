import { supabase } from './supabase'

export async function getVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('id, name, description, cuisine_type, location_in_court, is_open, image_url, phone_number, menu_items(id, name, price, category, is_veg)')

  if (error) {
    console.error('Error fetching vendors:', error)
    return []
  }

  return data ?? []
}

export async function getVendorById(id: string) {
  const { data, error } = await supabase
    .from('vendors')
    .select('id, name, description, cuisine_type, location_in_court, is_open, image_url, phone_number')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return null
  }

  return data
}

export async function getMenuItems(vendorId: string) {
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


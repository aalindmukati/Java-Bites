export const dynamic = 'force-dynamic'

import { getVendors } from '@/lib/data'
import { addVendor, addMenuItem } from '@/app/actions'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default async function AdminPage() {
  const vendors = await getVendors()

  return (
    <main className="min-h-screen py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage vendors and menus for Java Bites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ADD VENDOR */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Vendor</CardTitle>
            </CardHeader>

            <CardContent>
              <form action={addVendor} className="space-y-4">

                <Input name="name" required placeholder="Vendor Name" />

                <Textarea name="description" placeholder="Description" />

                <Input name="cuisine_type" required placeholder="Cuisine Type" />

                <Input name="location_in_court" required placeholder="Location" />

                <Input name="image_url" placeholder="Image URL" />

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_open" defaultChecked />
                  Open
                </label>

                <Button type="submit" className="w-full">
                  Add Vendor
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ADD MENU ITEM */}
          <Card>
            <CardHeader>
              <CardTitle>Add Menu Item</CardTitle>
            </CardHeader>

            <CardContent>
              <form action={addMenuItem} className="space-y-4">

                <select name="vendor_id" required className="w-full p-2 border rounded">
                  <option value="">Select Vendor</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>

                <Input name="name" required placeholder="Item Name" />

                <Input name="price" type="number" required placeholder="Price" />

                <Input name="category" required placeholder="Category" />

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_veg" defaultChecked />
                  Vegetarian
                </label>

                <Button type="submit" className="w-full">
                  Add Menu Item
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  )
}
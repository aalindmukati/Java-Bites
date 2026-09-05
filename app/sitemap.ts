import { MetadataRoute } from "next";
import { getVendors } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vendors = await getVendors();

  const vendorEntries: MetadataRoute.Sitemap = vendors
    .filter((vendor) => vendor.slug)
    .map((vendor) => ({
      url: `https://java-bites.vercel.app/vendors/${vendor.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    {
      url: "https://java-bites.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://java-bites.vercel.app/vendors",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...vendorEntries,
  ];
}

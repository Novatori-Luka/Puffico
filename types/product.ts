export type ProductSize = "S" | "M" | "L" | "XL";
export type ProductShape = "მრგვალი" | "კვადრატი" | "სხვა";
export type ProductFilling = "ბუნებრივი" | "სინთეტიკური";
export type ProductCategory = "Standard" | "Premium" | "Luxury";

export interface ProductVariantData {
  id?: string;
  size?: ProductSize | null;
  color?: string | null;
  colorHex?: string | null;
  shape?: ProductShape | null;
  filling?: ProductFilling | null;
  priceAdj?: number | null;
  stock: number;
  sku?: string | null;
}

export interface ProductImageData {
  id?: string;
  url: string;
  alt?: string | null;
  position: number;
  isPrimary: boolean;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  basePrice: number;
  salePrice?: number | null;
  sku: string;
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  category?: ProductCategory | null;
  metaTitle?: string;
  metaDesc?: string;
  variants: ProductVariantData[];
  images: ProductImageData[];
}

// What the catalog page works with
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  basePrice: number;
  salePrice?: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  stock: number;
  category?: string | null;
  images: ProductImageData[];
  variants: ProductVariantData[];
}

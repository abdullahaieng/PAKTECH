import { revalidatePath } from "next/cache";

export function revalidateStorePages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/product/${slug}`);
  else revalidatePath("/product", "layout");
}

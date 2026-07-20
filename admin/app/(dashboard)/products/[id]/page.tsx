"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, type Product } from "@/lib/api";

const emptyProduct: Partial<Product> = {
  name: "", slug: "", description: "", shortDescription: "",
  price: 0, stock: 10, category: "airpods-earbuds", brand: "PakTech",
  sku: "", images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop"],
};

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";
  const [form, setForm] = useState<Partial<Product>>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      api.getProduct(id).then(setForm).catch(console.error);
    }
  }, [id, isNew]);

  const handleChange = (key: keyof Product, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        await api.createProduct(form);
      } else {
        await api.updateProduct(id, form);
      }
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link href="/products" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="text-2xl font-bold mb-6">{isNew ? "Add Product" : "Edit Product"}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        {(["name", "slug", "sku", "brand", "shortDescription"] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              value={String(form[field] ?? "")}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required={field !== "shortDescription"}
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (PKR)</label>
            <input type="number" value={form.price ?? 0} onChange={(e) => handleChange("price", Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sale Price (optional)</label>
            <input type="number" value={form.salePrice ?? ""} onChange={(e) => handleChange("salePrice", Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" value={form.stock ?? 0} onChange={(e) => handleChange("stock", Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={form.category ?? ""} onChange={(e) => handleChange("category", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              {["airpods-earbuds","smart-watches","power-banks","fast-chargers","usb-cables","bluetooth-speakers","gaming-accessories","mobile-accessories","car-accessories"].map((c) => (
                <option key={c} value={c}>{c.replace(/-/g, " ")}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={form.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>

        <div className="flex gap-4">
          {(["isFeatured", "isBestSeller", "isNewArrival", "isFlashSale"] as const).map((flag) => (
            <label key={flag} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form[flag]} onChange={(e) => handleChange(flag, e.target.checked)} />
              {flag.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
            </label>
          ))}
        </div>

        <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
          {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Trash2, Upload } from "lucide-react";
import { api, type Product } from "@/lib/admin/api";
import { slugify } from "@/lib/utils";

const emptyProduct: Partial<Product> = {
  name: "", slug: "", description: "", shortDescription: "",
  price: 0, stock: 10, category: "airpods-earbuds", brand: "PakTech",
  sku: "", images: [""],
};

function createSku(name: string): string {
  const prefix = slugify(name).replace(/-/g, "").slice(0, 4).toUpperCase() || "PROD";
  return `PKT-${prefix}-${Date.now().toString().slice(-5)}`;
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";
  const [form, setForm] = useState<Partial<Product>>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      api.getProduct(id).then(setForm).catch(console.error);
    }
  }, [id, isNew]);

  const handleChange = (key: keyof Product, value: string | number | boolean | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug && !isNew ? prev.slug : slugify(value),
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...(prev.images ?? [])];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const handleImageFileChange = (index: number, file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const token = typeof window !== "undefined" ? localStorage.getItem("paktech-admin-token") : null;

    fetch("/api/admin/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type") ?? "";
        return contentType.includes("application/json")
          ? res.json()
          : { success: false, error: await res.text() || res.statusText };
      })
      .then((data) => {
        const uploadedUrl = data?.data?.url;
        if (data?.success && uploadedUrl) {
          handleImageChange(index, uploadedUrl);
        } else {
          setError(data.error || "Upload failed");
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Upload error"))
      .finally(() => setUploading(false));
  };

  const addImage = () => {
    setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), ""] }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const images = [...(prev.images ?? [])];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        slug: form.slug?.trim() || slugify(form.name ?? ""),
        sku: form.sku?.trim() || createSku(form.name ?? ""),
        images: (form.images ?? []).filter((url) => url.trim().length > 0),
        salePrice: form.salePrice && form.salePrice > 0 ? form.salePrice : undefined,
      };

      if (isNew) {
        await api.createProduct(payload);
      } else {
        await api.updateProduct(id, payload);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link href="/admin/products" className="flex items-center gap-2 text-sm text-[var(--admin-muted)] hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="text-2xl font-bold mb-6">{isNew ? "Add Product" : "Edit Product"}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            value={form.name ?? ""}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            value={form.brand ?? ""}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <input
            value={form.shortDescription ?? ""}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (PKR)</label>
            <input type="number" value={form.price ?? 0} onChange={(e) => handleChange("price", Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sale Price (optional)</label>
            <input type="number" value={form.salePrice ?? ""} onChange={(e) => handleChange("salePrice", e.target.value === "" ? undefined : Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
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
          <textarea value={form.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} rows={4} minLength={10} className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Product Images</label>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(form.images ?? []).map((imageUrl, index) => (
              <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="relative aspect-square bg-slate-50">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ImagePlus className="h-10 w-10" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 p-3">
                  <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    {imageUrl ? "Replace" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFileChange(index, file);
                          e.target.value = "";
                        }
                      }}
                      className="sr-only"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    aria-label={`Remove product image ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
            </div>
            <button
              type="button"
              onClick={addImage}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              Add image
            </button>
            {uploading && <p className="text-xs text-blue-600">Uploading...</p>}
          </div>
        </div>

        <div className="flex gap-4">
          {(["isFeatured", "isBestSeller", "isNewArrival", "isFlashSale"] as const).map((flag) => (
            <label key={flag} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form[flag]} onChange={(e) => handleChange(flag, e.target.checked)} />
              {flag.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
            </label>
          ))}
        </div>

        <button type="submit" disabled={saving || uploading} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
          {saving ? "Saving..." : uploading ? "Uploading..." : isNew ? "Create Product" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

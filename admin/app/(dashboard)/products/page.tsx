"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api, type Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-[var(--muted)] mt-1">{products.length} products</p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-[var(--muted)]">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Product</th>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Category</th>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Price</th>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Stock</th>
                <th className="text-right p-4 font-medium text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-[var(--muted)]">{product.sku}</p>
                  </td>
                  <td className="p-4 capitalize text-[var(--muted)]">{product.category.replace(/-/g, " ")}</td>
                  <td className="p-4">
                    <span className="font-semibold">{formatPrice(product.salePrice ?? product.price)}</span>
                    {product.salePrice && (
                      <span className="text-xs text-[var(--muted)] line-through ml-2">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={product.stock <= 5 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/products/${product.id}`} className="p-1.5 rounded hover:bg-slate-100">
                        <Pencil className="h-4 w-4 text-[var(--muted)]" />
                      </Link>
                      <button onClick={() => handleDelete(product.id, product.name)} className="p-1.5 rounded hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

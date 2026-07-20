"use client";

import { useEffect, useState } from "react";
import { Percent, Trash2, Zap, Tag } from "lucide-react";
import { api, type Product, type Category } from "@/lib/admin/api";
import { formatPrice } from "@/lib/format";

export default function AdminSalesPage() {
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [percentOff, setPercentOff] = useState(20);
  const [category, setCategory] = useState("all");
  const [flashSale, setFlashSale] = useState(false);
  const [applying, setApplying] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([api.getSaleProducts(), api.getCategories()])
      .then(([sales, cats]) => {
        setSaleProducts(sales.products);
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setMsg("");
    try {
      const result = await api.applySale({
        percentOff,
        category: category === "all" ? undefined : category,
        flashSale,
      });
      setMsg(result.message);
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed");
    } finally {
      setApplying(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Remove all sales for the selected category?")) return;
    try {
      const result = await api.clearSales(category === "all" ? undefined : category);
      setMsg(result.message);
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remove sale from "${name}"?`)) return;
    try {
      await api.removeProductSale(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Sales & Promotions</h1>
        <p className="text-[var(--admin-muted)] mt-1">Apply or remove discounts on products</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <form onSubmit={handleApply} className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Percent className="h-4 w-4 text-indigo-600" /> Apply Bulk Sale
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount %</label>
              <input
                type="number"
                min={1}
                max={90}
                value={percentOff}
                onChange={(e) => setPercentOff(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Products</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={flashSale} onChange={(e) => setFlashSale(e.target.checked)} />
            <Zap className="h-4 w-4 text-amber-500" />
            Also add Flash Sale badge
          </label>

          <button
            type="submit"
            disabled={applying}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Sale"}
          </button>
        </form>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4 text-red-500" /> Remove Sales
          </h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Select a category and all sale prices will be removed.
          </p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Products</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleClear}
            className="border border-red-200 text-red-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-red-50"
          >
            Clear Sales
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-6 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg">{msg}</div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Products on Sale ({saleProducts.length})</h2>
        </div>
        {loading ? (
          <p className="p-8 text-center text-[var(--admin-muted)]">Loading...</p>
        ) : saleProducts.length === 0 ? (
          <p className="p-8 text-center text-[var(--admin-muted)]">No products on sale yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Product</th>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Original</th>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Sale Price</th>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Off</th>
                <th className="text-right p-4 font-medium text-[var(--admin-muted)]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {saleProducts.map((p) => {
                const off = p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium">
                      {p.name}
                      {p.isFlashSale && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Flash</span>
                      )}
                    </td>
                    <td className="p-4 text-[var(--admin-muted)] line-through">{formatPrice(p.price)}</td>
                    <td className="p-4 font-semibold text-indigo-600">{formatPrice(p.salePrice!)}</td>
                    <td className="p-4 text-green-600 font-medium">-{off}%</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRemove(p.id, p.name)}
                        className="p-1.5 rounded hover:bg-red-50"
                        title="Remove sale"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

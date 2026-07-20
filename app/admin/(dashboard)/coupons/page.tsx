"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Ticket } from "lucide-react";
import { api, type Coupon } from "@/lib/admin/api";

const emptyForm = { code: "", discount: 10, description: "", active: true };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editCode, setEditCode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.getCoupons().then(setCoupons).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditCode(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editCode) {
        await api.updateCoupon(editCode, {
          discount: form.discount,
          description: form.description,
          active: form.active,
        });
      } else {
        await api.createCoupon({
          code: form.code.toUpperCase(),
          discount: form.discount,
          description: form.description,
          active: form.active,
        });
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditCode(coupon.code);
    setForm({
      code: coupon.code,
      discount: coupon.discount,
      description: coupon.description ?? "",
      active: coupon.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.deleteCoupon(code);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await api.updateCoupon(coupon.code, { active: !coupon.active });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-[var(--admin-muted)] mt-1">Create and manage discount codes</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> New Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-md mb-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            {editCode ? `Edit ${editCode}` : "New Coupon"}
          </h2>
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full border rounded-lg px-3 py-2 text-sm uppercase font-mono"
              placeholder="PAKTECH20"
              required
              disabled={!!editCode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount %</label>
            <input
              type="number"
              min={1}
              max={90}
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Summer sale 20% off"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active (customers can use this code)
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : editCode ? "Update" : "Create Coupon"}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[var(--admin-muted)] hover:text-foreground">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 max-w-2xl">
        {loading ? (
          <p className="text-[var(--admin-muted)]">Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="text-[var(--admin-muted)]">No coupons yet — create one above</p>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.code} className="bg-white rounded-xl border p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg font-mono">{coupon.code}</p>
                <p className="text-sm text-[var(--admin-muted)]">
                  {coupon.discount}% off{coupon.description ? ` — ${coupon.description}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(coupon)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${coupon.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {coupon.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => handleEdit(coupon)} className="p-1.5 rounded hover:bg-slate-100">
                  <Pencil className="h-4 w-4 text-[var(--admin-muted)]" />
                </button>
                <button onClick={() => handleDelete(coupon.code)} className="p-1.5 rounded hover:bg-red-50">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

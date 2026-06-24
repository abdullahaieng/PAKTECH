"use client";

import { useEffect, useState } from "react";
import { api, type StoreSettings } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="text-[var(--muted)]">Loading...</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--muted)] mt-1">Store shipping and general settings</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border p-6 max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Free Shipping Threshold (PKR)</label>
          <input
            type="number"
            value={settings.freeShippingThreshold}
            onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Standard Shipping (PKR)</label>
          <input
            type="number"
            value={settings.standardShipping}
            onChange={(e) => setSettings({ ...settings, standardShipping: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Express Shipping (PKR)</label>
          <input
            type="number"
            value={settings.expressShipping}
            onChange={(e) => setSettings({ ...settings, expressShipping: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const result = await api.changeAdminPassword(currentPassword, newPassword);
            setPasswordMsg(result.devNote ?? result.message);
            setCurrentPassword("");
            setNewPassword("");
          } catch (err) {
            setPasswordMsg(err instanceof Error ? err.message : "Failed");
          }
        }}
        className="bg-white rounded-xl border p-6 max-w-md space-y-4 mt-6"
      >
        <h3 className="font-semibold">Admin Password</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required minLength={6} />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
          Change Admin Password
        </button>
        {passwordMsg && <p className="text-xs text-[var(--muted)]">{passwordMsg}</p>}
      </form>

      <div className="mt-8 bg-slate-50 rounded-xl border p-5 max-w-md">
        <h3 className="font-semibold text-sm mb-2">Database Integration</h3>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          When Firestore is enabled, user and store data persist in Firebase rather than the local JSON file.
          In production, set <code className="bg-slate-200 px-1 rounded">FIRESTORE_ENABLED=true</code> and provide a Firebase service account via <code className="bg-slate-200 px-1 rounded">FIREBASE_SERVICE_ACCOUNT_PATH</code> or <code className="bg-slate-200 px-1 rounded">FIREBASE_SERVICE_ACCOUNT_JSON</code>.
        </p>
      </div>
    </div>
  );
}

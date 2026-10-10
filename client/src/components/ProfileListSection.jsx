import { useState } from 'react';

export default function ProfileListSection({ title, items, fields, renderItem, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    await onAdd(form);
    setForm(Object.fromEntries(fields.map((f) => [f.name, ''])));
    setAdding(false);
    setSaving(false);
  }

  return (
    <div className="border border-line rounded-sm p-6 bg-white max-w-2xl mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-ink">{title}</h2>
        {!adding && <button onClick={() => setAdding(true)} className="text-sm text-forge font-medium">+ Add</button>}
      </div>

      {items.length === 0 && !adding && <p className="text-sm text-muted">Nothing added yet.</p>}

      <ul className="space-y-3 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-start border-b border-line pb-3 last:border-0">
            <div className="text-sm text-ink">{renderItem(item)}</div>
            <button onClick={() => onDelete(item.id)} className="text-xs text-muted hover:text-red-700 ml-4 shrink-0">Remove</button>
          </li>
        ))}
      </ul>

      {adding && (
        <form onSubmit={handleAdd} className="space-y-3 border-t border-line pt-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs text-muted mb-1">{f.label}</label>
              <input
                type={f.type || 'text'} value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required={f.required}
                className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-forge"
              />
            </div>
          ))}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-ink text-paper rounded-sm px-3 py-1.5 text-sm font-medium hover:bg-forge transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="text-sm text-muted">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
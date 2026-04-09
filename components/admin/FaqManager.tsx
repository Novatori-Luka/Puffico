"use client";

import { useState, useTransition } from "react";
import { createFaqItem, updateFaqItem, deleteFaqItem } from "@/app/actions/faq";
import { Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Props {
  items: FaqItem[];
}

function emptyForm() {
  return { question: "", answer: "", category: "general" };
}

export default function FaqManager({ items }: Props) {
  const [pending, startTransition] = useTransition();

  // Add form state
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm());

  // Expanded answer preview
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleAdd() {
    if (!addForm.question.trim() || !addForm.answer.trim()) return;
    startTransition(async () => {
      await createFaqItem(addForm);
      setAddForm(emptyForm());
      setAdding(false);
    });
  }

  function startEdit(item: FaqItem) {
    setEditingId(item.id);
    setEditForm({ question: item.question, answer: item.answer, category: item.category });
  }

  function handleUpdate(id: string) {
    if (!editForm.question.trim() || !editForm.answer.trim()) return;
    startTransition(async () => {
      await updateFaqItem(id, editForm);
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("კითხვის წაშლა?")) return;
    startTransition(() => deleteFaqItem(id));
  }

  return (
    <div className="space-y-4">
      {/* List */}
      {items.length === 0 && !adding && (
        <div className="card p-16 text-center">
          <HelpCircle size={40} className="mx-auto text-sand-300 mb-4" />
          <p className="text-puff-muted">კითხვები არ არსებობს.</p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) =>
          editingId === item.id ? (
            /* ── Edit inline ── */
            <div key={item.id} className="card p-5 space-y-3 border-earth-300">
              <div>
                <label className="field-label">კითხვა</label>
                <input
                  value={editForm.question}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                  className="input-field"
                  placeholder="კითხვა ქართულად"
                  autoFocus
                />
              </div>
              <div>
                <label className="field-label">პასუხი</label>
                <textarea
                  value={editForm.answer}
                  onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="პასუხი ქართულად"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate(item.id)}
                  disabled={pending}
                  className="btn-primary py-2 px-4 text-sm disabled:opacity-60"
                >
                  <Check size={14} />
                  შენახვა
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  <X size={14} />
                  გაუქმება
                </button>
              </div>
            </div>
          ) : (
            /* ── Read row ── */
            <div key={item.id} className="card overflow-hidden">
              <div className="flex items-start justify-between gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="flex-1 text-left flex items-start gap-2 min-w-0"
                >
                  {expandedId === item.id ? (
                    <ChevronUp size={16} className="text-earth-400 shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown size={16} className="text-puff-muted shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium text-puff-dark text-sm leading-snug">{item.question}</span>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 rounded-lg text-puff-muted hover:text-earth-500 hover:bg-earth-50 transition-colors"
                    title="რედაქტირება"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={pending}
                    className="p-1.5 rounded-lg text-puff-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    title="წაშლა"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {expandedId === item.id && (
                <div className="px-4 pb-4 pl-10 text-sm text-puff-muted leading-relaxed border-t border-sand-50 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Add form */}
      {adding ? (
        <div className="card p-5 space-y-3 border-dashed border-earth-300">
          <h3 className="font-medium text-puff-dark text-sm">ახალი კითხვა</h3>
          <div>
            <label className="field-label">კითხვა</label>
            <input
              value={addForm.question}
              onChange={(e) => setAddForm({ ...addForm, question: e.target.value })}
              className="input-field"
              placeholder="კითხვა ქართულად"
              autoFocus
            />
          </div>
          <div>
            <label className="field-label">პასუხი</label>
            <textarea
              value={addForm.answer}
              onChange={(e) => setAddForm({ ...addForm, answer: e.target.value })}
              rows={4}
              className="input-field resize-none"
              placeholder="პასუხი ქართულად"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={pending || !addForm.question.trim() || !addForm.answer.trim()}
              className="btn-primary py-2 px-4 text-sm disabled:opacity-60"
            >
              <Check size={14} />
              {pending ? "ინახება..." : "დამატება"}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setAddForm(emptyForm()); }}
              className="btn-secondary py-2 px-4 text-sm"
            >
              <X size={14} />
              გაუქმება
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="btn-secondary w-full justify-center"
        >
          <Plus size={16} />
          კითხვის დამატება
        </button>
      )}
    </div>
  );
}

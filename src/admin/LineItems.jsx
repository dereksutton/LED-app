"use client";
import { centsToInput, lineTotal, money, toCents } from './format';
import { Input } from './ui';

// Editable rows of description, quantity and price. Prices are typed in
// dollars and kept in cents.
export default function LineItems({ items, onChange, disabled }) {
  const update = (i, patch) => onChange(items.map((item, j) => (j === i ? { ...item, ...patch } : item)));
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, { description: '', quantity: 1, unitPriceCents: 0, priceText: '' }]);

  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-[1fr_80px_120px_100px_32px] gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid">
        <span>Description</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Amount</span><span />
      </div>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-2 rounded-lg border border-slate-200 p-2 sm:grid-cols-[1fr_80px_120px_100px_32px] sm:border-0 sm:p-0">
          <textarea
            aria-label={`Line ${i + 1} description`}
            rows={1}
            value={item.description}
            disabled={disabled}
            onChange={(e) => update(i, { description: e.target.value })}
            placeholder="e.g. Paint living room walls, 2 coats"
            className="col-span-3 block min-h-[4.5rem] w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-base sm:col-span-1 sm:min-h-0 sm:text-sm"
          />
          <Input
            aria-label={`Line ${i + 1} quantity`}
            inputMode="decimal"
            value={item.quantityText ?? String(item.quantity ?? '')}
            disabled={disabled}
            onChange={(e) => update(i, { quantityText: e.target.value, quantity: Number(e.target.value) || 0 })}
            className="text-right"
          />
          <Input
            aria-label={`Line ${i + 1} price in dollars`}
            inputMode="decimal"
            placeholder="0.00"
            value={item.priceText ?? centsToInput(item.unitPriceCents)}
            disabled={disabled}
            onChange={(e) => update(i, { priceText: e.target.value, unitPriceCents: toCents(e.target.value) })}
            className="text-right"
          />
          <span className="col-span-2 self-center text-right text-sm font-medium text-slate-700 sm:col-span-1">{money(lineTotal(item))}</span>
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={disabled}
            aria-label={`Remove line ${i + 1}`}
            className="row-start-2 col-start-3 self-center rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 sm:row-start-auto sm:col-start-auto"
          >
            ✕
          </button>
        </div>
      ))}
      {!disabled && (
        <button type="button" onClick={add} className="text-sm font-semibold text-slate-700 hover:text-slate-900">+ Add a line</button>
      )}
    </div>
  );
}

// Strips the typing helpers before saving.
export const cleanItems = (items) => items
  .filter((i) => i.description.trim())
  .map(({ description, quantity, unitPriceCents }) => ({ description: description.trim(), quantity, unitPriceCents }));

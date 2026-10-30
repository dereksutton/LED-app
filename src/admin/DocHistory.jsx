import { dateTime } from './format';

export default function DocHistory({ history = [] }) {
  if (!history.length) return null;
  return (
    <ol className="space-y-2 text-sm">
      {[...history].reverse().map((h, i) => (
        <li key={i} className="flex justify-between gap-3">
          <span className="text-slate-700">{h.event}</span>
          <span className="shrink-0 text-xs text-slate-500">{dateTime(h.at)}</span>
        </li>
      ))}
    </ol>
  );
}

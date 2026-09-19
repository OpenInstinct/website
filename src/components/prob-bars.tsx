// Probability bars for one question. The gold tick marks the reference label
// (teacher or gold target) when one exists, so calibration is visible per option.

type Props = {
  options: string[];
  probs: number[];
  targets?: number[];
  independent?: boolean; // multi: each option is its own yes/no, no single winner
};

export function ProbBars({ options, probs, targets, independent }: Props) {
  const top = independent ? -1 : probs.indexOf(Math.max(...probs));
  return (
    <ul className="flex flex-col gap-3">
      {options.map((opt, i) => {
        const p = probs[i] ?? 0;
        const t = targets?.[i];
        return (
          <li key={i}>
            <div className="flex items-baseline gap-3 text-sm">
              <span className={i === top ? "font-medium" : "text-muted"}>{opt}</span>
              <span className={`ml-auto shrink-0 ${i === top ? "font-semibold" : "text-muted"}`}>
                {(p * 100).toFixed(1)}%
              </span>
            </div>
            <div className="relative mt-1 h-2.5 rounded-full bg-line/60">
              <div
                className={`bar-fill h-full rounded-full ${i === top || independent ? "bg-signal" : "bg-signal/35"}`}
                style={{ width: `${Math.max(p * 100, 0.5)}%` }}
              />
              {t !== undefined && (
                <span
                  aria-label={`Reference label ${(t * 100).toFixed(0)}%`}
                  title={`Reference label ${(t * 100).toFixed(0)}%`}
                  className="absolute -top-1 h-4.5 w-0.75 -translate-x-1/2 rounded-sm bg-gold"
                  style={{ left: `${t * 100}%` }}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

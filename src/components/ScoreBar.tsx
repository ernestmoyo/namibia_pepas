import { cn } from "@/lib/utils"

interface ScoreBarProps {
  score: number
  maxScore?: number
  showLabel?: boolean
  size?: "sm" | "md"
}

export default function ScoreBar({
  score,
  maxScore = 100,
  showLabel = true,
  size = "md",
}: ScoreBarProps) {
  const pct = Math.min((score / maxScore) * 100, 100)
  const barColor =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 60
        ? "bg-amber-500"
        : pct >= 40
          ? "bg-orange-500"
          : "bg-red-500"

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex-1 rounded-full bg-slate-100 overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            "font-semibold tabular-nums",
            size === "sm" ? "text-xs w-8" : "text-sm w-10",
            pct >= 80
              ? "text-emerald-600"
              : pct >= 60
                ? "text-amber-600"
                : pct >= 40
                  ? "text-orange-600"
                  : "text-red-600"
          )}
        >
          {score}
        </span>
      )}
    </div>
  )
}

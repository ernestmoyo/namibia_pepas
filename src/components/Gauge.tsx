import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  max?: number
  label: string
  sublabel?: string
  size?: "sm" | "md" | "lg"
}

export default function Gauge({
  value,
  max = 100,
  label,
  sublabel,
  size = "md",
}: GaugeProps) {
  const pct = Math.min(Math.max(value / max, 0), 1)
  const angle = -180 + pct * 180 // -180 (left) to 0 (right), matching arc

  const dims = {
    sm: { w: 100, h: 60, r: 40, stroke: 8, fontSize: 14, labelSize: 9 },
    md: { w: 140, h: 80, r: 55, stroke: 10, fontSize: 18, labelSize: 10 },
    lg: { w: 180, h: 100, r: 70, stroke: 12, fontSize: 22, labelSize: 11 },
  }
  const d = dims[size]
  const cx = d.w / 2
  const cy = d.h - 5

  // Arc path for background and fill
  const arcPath = (radius: number, startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  // Needle endpoint
  const needleRad = (angle * Math.PI) / 180
  const needleLen = d.r - 8
  const nx = cx + needleLen * Math.cos(needleRad)
  const ny = cy + needleLen * Math.sin(needleRad)

  // Color based on value
  const getColor = () => {
    if (pct >= 0.8) return "#009543" // Namibia green
    if (pct >= 0.6) return "#FFD700" // Namibia gold
    if (pct >= 0.4) return "#f59e0b" // amber
    return "#c8102e" // Namibia red
  }

  const color = getColor()

  return (
    <div className="flex flex-col items-center">
      <svg width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`}>
        {/* Background arc (gray) */}
        <path
          d={arcPath(d.r, -180, 0)}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={d.stroke}
          strokeLinecap="round"
        />

        {/* Color segments */}
        <path
          d={arcPath(d.r, -180, -135)}
          fill="none"
          stroke="#c8102e"
          strokeWidth={d.stroke}
          strokeLinecap="round"
          opacity={0.3}
        />
        <path
          d={arcPath(d.r, -135, -90)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={d.stroke}
          strokeLinecap="round"
          opacity={0.3}
        />
        <path
          d={arcPath(d.r, -90, -45)}
          fill="none"
          stroke="#FFD700"
          strokeWidth={d.stroke}
          strokeLinecap="round"
          opacity={0.3}
        />
        <path
          d={arcPath(d.r, -45, 0)}
          fill="none"
          stroke="#009543"
          strokeWidth={d.stroke}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Filled arc up to value */}
        <path
          d={arcPath(d.r, -180, -180 + pct * 180)}
          fill="none"
          stroke={color}
          strokeWidth={d.stroke}
          strokeLinecap="round"
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#1e293b"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Needle center dot */}
        <circle cx={cx} cy={cy} r={4} fill="#1e293b" />
        <circle cx={cx} cy={cy} r={2} fill="white" />

        {/* Value text */}
        <text
          x={cx}
          y={cy - 14}
          textAnchor="middle"
          fontSize={d.fontSize}
          fontWeight="700"
          fill={color}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {value}
        </text>

        {/* Min/Max labels */}
        <text
          x={cx - d.r + 5}
          y={cy + 12}
          textAnchor="start"
          fontSize={8}
          fill="#94a3b8"
          fontFamily="Inter, system-ui, sans-serif"
        >
          0
        </text>
        <text
          x={cx + d.r - 5}
          y={cy + 12}
          textAnchor="end"
          fontSize={8}
          fill="#94a3b8"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {max}
        </text>
      </svg>
      <p
        className={cn(
          "font-semibold text-slate-900 text-center leading-tight mt-1",
          size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm"
        )}
      >
        {label}
      </p>
      {sublabel && (
        <p className="text-[9px] text-slate-400 text-center">{sublabel}</p>
      )}
    </div>
  )
}

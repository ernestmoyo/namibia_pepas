import type { RiskTier } from "@/lib/types"
import { getRiskColor, getRiskDot } from "@/lib/utils"

interface RiskBadgeProps {
  tier: RiskTier
}

export default function RiskBadge({ tier }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getRiskColor(tier)}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getRiskDot(tier)}`} />
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}

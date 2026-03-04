import { getStatusBadge, statusLabel } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(status)}`}
    >
      {statusLabel(status)}
    </span>
  )
}

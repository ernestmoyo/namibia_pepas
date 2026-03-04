import type { RiskTier } from "./types"

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `N$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `N$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `N$${(value / 1_000).toFixed(0)}K`
  return `N$${value}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NA").format(value)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600"
  if (score >= 60) return "text-amber-600"
  if (score >= 40) return "text-orange-600"
  return "text-red-600"
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-800"
  if (score >= 60) return "bg-amber-100 text-amber-800"
  if (score >= 40) return "bg-orange-100 text-orange-800"
  return "bg-red-100 text-red-800"
}

export function getRiskColor(tier: RiskTier): string {
  const map: Record<RiskTier, string> = {
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }
  return map[tier]
}

export function getRiskDot(tier: RiskTier): string {
  const map: Record<RiskTier, string> = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  }
  return map[tier]
}

export function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    approved: "bg-emerald-100 text-emerald-800",
    published: "bg-emerald-100 text-emerald-800",
    completed: "bg-emerald-100 text-emerald-800",
    on_track: "bg-emerald-100 text-emerald-800",
    closed: "bg-emerald-100 text-emerald-800",
    draft: "bg-slate-100 text-slate-800",
    not_started: "bg-slate-100 text-slate-800",
    planned: "bg-slate-100 text-slate-800",
    review: "bg-blue-100 text-blue-800",
    under_review: "bg-blue-100 text-blue-800",
    in_progress: "bg-blue-100 text-blue-800",
    pending_approval: "bg-blue-100 text-blue-800",
    submitted: "bg-blue-100 text-blue-800",
    at_risk: "bg-amber-100 text-amber-800",
    expired: "bg-orange-100 text-orange-800",
    overdue: "bg-red-100 text-red-800",
    off_track: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    open: "bg-amber-100 text-amber-800",
    cancelled: "bg-slate-100 text-slate-800",
    board_approved: "bg-indigo-100 text-indigo-800",
  }
  return map[status] ?? "bg-slate-100 text-slate-800"
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

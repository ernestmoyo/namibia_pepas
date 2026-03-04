import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Search,
  Filter,
  FileDown,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import DataTable from "@/components/DataTable"
import StatusBadge from "@/components/StatusBadge"
import ScoreBar from "@/components/ScoreBar"
import StatCard from "@/components/StatCard"
import {
  soes,
  quarterlySubmissions,
  correctiveActions,
} from "@/data/mock"
import { cn } from "@/lib/utils"
import type { QuarterlySubmission } from "@/lib/types"

export default function Scorecards() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = quarterlySubmissions.filter((qs) => {
    const soe = soes.find((s) => s.id === qs.soeId)
    const matchesSearch =
      !search || soe?.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || qs.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    submitted: quarterlySubmissions.filter((q) =>
      ["submitted", "under_review", "approved"].includes(q.status)
    ).length,
    approved: quarterlySubmissions.filter((q) => q.status === "approved").length,
    rejected: quarterlySubmissions.filter((q) => q.status === "rejected").length,
    avgScore: Math.round(
      quarterlySubmissions.reduce((sum, q) => sum + q.overallScore, 0) /
        quarterlySubmissions.length
    ),
  }

  const scoreDistribution = soes
    .filter((s) => s.overallScore > 0)
    .map((s) => ({
      name: s.acronym || s.name.slice(0, 8),
      score: s.overallScore,
    }))
    .sort((a, b) => b.score - a.score)

  const openActions = correctiveActions.filter(
    (a) => a.status === "open" || a.status === "in_progress" || a.status === "overdue"
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Quarterly Scorecards & Reporting
          </h1>
          <p className="text-sm text-slate-500">
            Quarterly performance submissions, evidence, and corrective actions
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
          <FileDown className="h-4 w-4" />
          Export Board Pack
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Submissions"
          value={stats.submitted}
          subtitle={`of ${soes.length} SOEs`}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Score"
          value={stats.avgScore}
          subtitle="across all submissions"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Score comparison chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          SOE Performance Comparison — Latest Quarter
        </h3>
        <p className="text-xs text-slate-500 mb-4">Overall scores across entities</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
              {scoreDistribution.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.score >= 80
                      ? "#22c55e"
                      : entry.score >= 60
                        ? "#f59e0b"
                        : entry.score >= 40
                          ? "#f97316"
                          : "#ef4444"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-400 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="under_review">Under Review</option>
            <option value="submitted">Submitted</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Submissions table */}
      <DataTable<QuarterlySubmission>
        keyFn={(q) => q.id}
        data={filtered}
        columns={[
          {
            key: "soe",
            header: "SOE",
            render: (q) => {
              const soe = soes.find((s) => s.id === q.soeId)
              return (
                <div>
                  <p className="font-medium text-slate-900">{soe?.name}</p>
                  <p className="text-xs text-slate-500">{soe?.sector}</p>
                </div>
              )
            },
          },
          {
            key: "quarter",
            header: "Period",
            render: (q) => `${q.quarter} ${q.year}`,
          },
          {
            key: "status",
            header: "Status",
            render: (q) => <StatusBadge status={q.status} />,
          },
          {
            key: "score",
            header: "Score",
            render: (q) => (
              <div className="w-24">
                <ScoreBar score={q.overallScore} size="sm" />
              </div>
            ),
          },
          {
            key: "evidence",
            header: "Evidence",
            render: (q) => (
              <span className="text-xs">{q.evidenceCount} files</span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (q) => (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-amber-600">{q.actionsOpen} open</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-600">{q.actionsClosed} closed</span>
              </div>
            ),
          },
          {
            key: "submitted",
            header: "Submitted",
            render: (q) =>
              q.submittedAt
                ? new Date(q.submittedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—",
          },
        ]}
      />

      {/* Corrective Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Open Corrective Actions ({openActions.length})
        </h3>
        <div className="space-y-2">
          {openActions.map((action) => {
            const soe = soes.find((s) => s.id === action.soeId)
            return (
              <div
                key={action.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {action.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {soe?.name} — {action.owner}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <StatusBadge status={action.status} />
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      action.escalationLevel >= 2
                        ? "bg-red-100 text-red-700"
                        : action.escalationLevel === 1
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    )}
                  >
                    L{action.escalationLevel}
                  </span>
                  <span className="text-xs text-slate-500">
                    Due: {action.dueDate}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

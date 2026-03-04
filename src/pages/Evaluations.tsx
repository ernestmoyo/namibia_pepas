import { useState } from "react"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import {
  Search,
  Filter,
  Plus,
  Award,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react"
import DataTable from "@/components/DataTable"
import StatusBadge from "@/components/StatusBadge"
import ScoreBar from "@/components/ScoreBar"
import StatCard from "@/components/StatCard"
import { soes, evaluationCycles } from "@/data/mock"
import { cn } from "@/lib/utils"
import type { EvaluationCycle } from "@/lib/types"

export default function Evaluations() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedEval, setSelectedEval] = useState<string | null>(null)

  const filtered = evaluationCycles.filter((ev) => {
    const soe = soes.find((s) => s.id === ev.soeId)
    const matchesSearch =
      !search || soe?.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || ev.type === typeFilter
    return matchesSearch && matchesType
  })

  const stats = {
    completed: evaluationCycles.filter((e) => e.status === "completed").length,
    inProgress: evaluationCycles.filter((e) => e.status === "in_progress").length,
    planned: evaluationCycles.filter((e) => e.status === "planned").length,
    avgScore: Math.round(
      evaluationCycles
        .filter((e) => e.overallScore !== null)
        .reduce((sum, e) => sum + (e.overallScore ?? 0), 0) /
        evaluationCycles.filter((e) => e.overallScore !== null).length
    ),
  }

  const selected = selectedEval
    ? evaluationCycles.find((e) => e.id === selectedEval)
    : null

  const radarData = selected?.overallScore !== null && selected
    ? [
        { dimension: "Strategy", score: selected.strategyScore ?? 0, fullMark: 100 },
        { dimension: "Financial", score: selected.financialScore ?? 0, fullMark: 100 },
        { dimension: "Governance", score: selected.governanceScore ?? 0, fullMark: 100 },
        { dimension: "Risk Mgmt", score: selected.riskScore ?? 0, fullMark: 100 },
        { dimension: "Service", score: selected.serviceScore ?? 0, fullMark: 100 },
      ]
    : []

  const completedEvals = evaluationCycles
    .filter((e) => e.overallScore !== null)
    .map((e) => {
      const soe = soes.find((s) => s.id === e.soeId)
      return {
        name: soe?.acronym || soe?.name.slice(0, 8) || "",
        score: e.overallScore!,
        type: e.type,
      }
    })
    .sort((a, b) => b.score - a.score)

  const dimensions = [
    { key: "strategyScore", label: "Strategy Delivery", desc: "Completion of key initiatives; outcome achievement vs targets" },
    { key: "financialScore", label: "Financial Stewardship", desc: "Budget discipline; audit outcomes; fiscal risk reduction" },
    { key: "governanceScore", label: "Governance & Compliance", desc: "Timely annual reports; policy adherence; committee effectiveness" },
    { key: "riskScore", label: "Risk Management", desc: "Risk register quality; action closure; incident response" },
    { key: "serviceScore", label: "Service & Development", desc: "Service delivery KPIs; citizen impact measures" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Board & Executive Evaluation
          </h1>
          <p className="text-sm text-slate-500">
            Outcome-based evaluation tied to strategy, finance, governance, risk, and service delivery
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" />
          New Evaluation Cycle
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Planned"
          value={stats.planned}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Average Score"
          value={stats.avgScore}
          subtitle="across completed evaluations"
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Evaluation Scores Comparison
          </h3>
          <p className="text-xs text-slate-500 mb-4">Completed evaluations</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={completedEvals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
                {completedEvals.map((entry, i) => (
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

        {/* Radar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Evaluation Dimensions
          </h3>
          <p className="text-xs text-slate-500 mb-2">
            Click a row below to view the radar profile
          </p>
          <select
            value={selectedEval ?? ""}
            onChange={(e) => setSelectedEval(e.target.value || null)}
            className="mb-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm w-full focus:border-primary-400 outline-none"
          >
            <option value="">Select an evaluation...</option>
            {evaluationCycles
              .filter((e) => e.overallScore !== null)
              .map((e) => {
                const soe = soes.find((s) => s.id === e.soeId)
                return (
                  <option key={e.id} value={e.id}>
                    {soe?.name} — {e.type.toUpperCase()} ({e.period})
                  </option>
                )
              })}
          </select>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={80}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#003580"
                  fill="#003580"
                  fillOpacity={0.2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[230px] text-sm text-slate-400">
              Select an evaluation above
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Dimensions Reference */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Evaluation Rubric — Balanced Dimensions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {dimensions.map((dim) => (
            <div
              key={dim.key}
              className="rounded-lg border border-slate-100 p-3"
            >
              <p className="text-sm font-semibold text-primary-600">
                {dim.label}
              </p>
              <p className="text-xs text-slate-500 mt-1">{dim.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search evaluations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-400 outline-none"
          >
            <option value="all">All Types</option>
            <option value="board">Board</option>
            <option value="ceo">CEO</option>
            <option value="executive">Executive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable<EvaluationCycle>
        keyFn={(e) => e.id}
        data={filtered}
        onRowClick={(e) => setSelectedEval(e.id)}
        columns={[
          {
            key: "soe",
            header: "SOE",
            render: (e) => {
              const soe = soes.find((s) => s.id === e.soeId)
              return (
                <div>
                  <p className="font-medium text-slate-900">{soe?.name}</p>
                  <p className="text-xs text-slate-500">{soe?.sector}</p>
                </div>
              )
            },
          },
          {
            key: "type",
            header: "Type",
            render: (e) => (
              <span className="text-xs font-medium uppercase">{e.type}</span>
            ),
          },
          { key: "period", header: "Period", render: (e) => e.period },
          {
            key: "status",
            header: "Status",
            render: (e) => <StatusBadge status={e.status} />,
          },
          {
            key: "strategy",
            header: "Strategy",
            render: (e) =>
              e.strategyScore !== null ? (
                <ScoreBar score={e.strategyScore} size="sm" />
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              ),
            className: "w-28",
          },
          {
            key: "financial",
            header: "Financial",
            render: (e) =>
              e.financialScore !== null ? (
                <ScoreBar score={e.financialScore} size="sm" />
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              ),
            className: "w-28",
          },
          {
            key: "governance",
            header: "Governance",
            render: (e) =>
              e.governanceScore !== null ? (
                <ScoreBar score={e.governanceScore} size="sm" />
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              ),
            className: "w-28",
          },
          {
            key: "overall",
            header: "Overall",
            render: (e) =>
              e.overallScore !== null ? (
                <span
                  className={cn(
                    "text-sm font-bold",
                    e.overallScore >= 80
                      ? "text-emerald-600"
                      : e.overallScore >= 60
                        ? "text-amber-600"
                        : e.overallScore >= 40
                          ? "text-orange-600"
                          : "text-red-600"
                  )}
                >
                  {e.overallScore}
                </span>
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              ),
          },
        ]}
      />
    </div>
  )
}

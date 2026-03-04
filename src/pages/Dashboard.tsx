import { Link } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import {
  FileCheck,
  BarChart3,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  UserCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import StatCard from "@/components/StatCard"
import RiskBadge from "@/components/RiskBadge"
import ScoreBar from "@/components/ScoreBar"
import StatusBadge from "@/components/StatusBadge"
import Gauge from "@/components/Gauge"
import NamibiaFlag from "@/components/NamibiaFlag"
import {
  dashboardStats,
  soes,
  portfolioTrend,
  riskDistribution,
  sectorBreakdown,
  correctiveActions,
} from "@/data/mock"
import { formatCurrency } from "@/lib/utils"

export default function Dashboard() {
  const topPerformers = [...soes].sort((a, b) => b.overallScore - a.overallScore).slice(0, 5)
  const atRiskEntities = soes.filter((s) => s.riskTier === "critical" || s.riskTier === "high")
  const overdueActions = correctiveActions.filter((a) => a.status === "overdue")

  return (
    <div className="space-y-6">
      {/* Hero with Namibia flag gradient */}
      <div className="rounded-xl overflow-hidden shadow-md">
        <div className="h-1.5 flex">
          <div className="flex-1 bg-[#003580]" />
          <div className="flex-1 bg-[#c8102e]" />
          <div className="flex-1 bg-[#009543]" />
          <div className="flex-1 bg-[#FFD700]" />
        </div>
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-[#009543] p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <NamibiaFlag width={48} height={32} />
              <div>
                <h1 className="text-2xl font-bold">Portfolio Overview</h1>
                <p className="mt-1 text-sm text-white/70">
                  Monitoring {dashboardStats.totalSOEs} State-Owned Enterprises —
                  FY 2025/26, Q3
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <TrendingUp className="h-4 w-4" />
              Last updated: 4 Mar 2026
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Contracts"
          value={dashboardStats.activeContracts}
          subtitle={`of ${dashboardStats.totalSOEs} SOEs`}
          icon={<FileCheck className="h-5 w-5" />}
          trend={{ value: 17, label: "vs last quarter" }}
        />
        <StatCard
          label="Quarterly Submissions"
          value={`${dashboardStats.quarterlySubmissionRate}%`}
          subtitle="on-time rate"
          icon={<BarChart3 className="h-5 w-5" />}
          trend={{ value: 8, label: "vs Q2" }}
        />
        <StatCard
          label="Compliance Rate"
          value={`${dashboardStats.complianceRate}%`}
          subtitle="annual reports published"
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend={{ value: 5, label: "vs prior year" }}
        />
        <StatCard
          label="Critical Risk"
          value={dashboardStats.criticalRiskEntities}
          subtitle="entities require intervention"
          icon={<ShieldAlert className="h-5 w-5" />}
          className="border-red-200"
        />
      </div>

      {/* SOE Performance Gauges */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              SOE Performance Gauges
            </h3>
            <p className="text-xs text-slate-500">
              Overall performance score for each entity
            </p>
          </div>
          <Link
            to="/scorecards"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1"
          >
            View details <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...soes]
            .sort((a, b) => b.overallScore - a.overallScore)
            .map((soe) => (
              <div
                key={soe.id}
                className="rounded-lg border border-slate-100 p-3 hover:border-primary-200 hover:shadow-sm transition-all cursor-pointer"
              >
                <Gauge
                  value={soe.overallScore}
                  label={soe.name}
                  sublabel={soe.sector}
                  size="sm"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio Trend */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Portfolio Performance Trend</h3>
          <p className="text-xs text-slate-500 mb-4">Average score & submission rate over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={portfolioTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="avgScore"
                name="Avg Score"
                stroke="#003580"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="submissions"
                name="Submissions"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Risk Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">{soes.length} entities by risk tier</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="count"
                nameKey="tier"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {riskDistribution.map((r) => (
              <div key={r.tier} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: r.color }}
                />
                {r.tier}: {r.count}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sector Performance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Performance by Sector</h3>
          <p className="text-xs text-slate-500 mb-4">Average score across sectors</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sectorBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis
                type="category"
                dataKey="sector"
                width={130}
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="avgScore" name="Avg Score" radius={[0, 4, 4, 0]}>
                {sectorBreakdown.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.avgScore >= 80
                        ? "#22c55e"
                        : entry.avgScore >= 60
                          ? "#f59e0b"
                          : entry.avgScore >= 40
                            ? "#f97316"
                            : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Top Performers</h3>
              <p className="text-xs text-slate-500">Highest scoring SOEs</p>
            </div>
            <Link
              to="/scorecards"
              className="text-xs text-primary-500 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topPerformers.map((soe, i) => (
              <div key={soe.id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{soe.name}</p>
                  <p className="text-xs text-slate-500">{soe.sector}</p>
                </div>
                <div className="w-24">
                  <ScoreBar score={soe.overallScore} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* At Risk Entities */}
        <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-slate-900">Entities Requiring Attention</h3>
          </div>
          <div className="space-y-3">
            {atRiskEntities.map((soe) => (
              <div
                key={soe.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{soe.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <RiskBadge tier={soe.riskTier} />
                    <StatusBadge status={soe.contractStatus} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{soe.overallScore}</p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(soe.totalLiabilities)} liabilities
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Actions */}
        <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Overdue Corrective Actions ({overdueActions.length})
            </h3>
          </div>
          <div className="space-y-3">
            {overdueActions.map((action) => {
              const soe = soes.find((s) => s.id === action.soeId)
              return (
                <div
                  key={action.id}
                  className="rounded-lg border border-slate-100 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {action.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {soe?.name} — {action.owner}
                      </p>
                    </div>
                    <span className="shrink-0 ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      L{action.escalationLevel}
                    </span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Due: {action.dueDate}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Module quick links */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">PEPAS Modules</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { name: "Contracts & KPIs", href: "/contracts", icon: FileCheck, desc: "Performance contract builder & KPI library" },
            { name: "Quarterly Scorecards", href: "/scorecards", icon: BarChart3, desc: "Quarterly reporting portal" },
            { name: "Fiscal Risk", href: "/fiscal-risk", icon: ShieldAlert, desc: "SOE fiscal risk dashboard" },
            { name: "Compliance", href: "/compliance", icon: CheckCircle2, desc: "Annual report tracker" },
            { name: "Evaluations", href: "/evaluations", icon: UserCheck, desc: "Board & executive evaluation" },
          ].map((mod) => (
            <Link
              key={mod.href}
              to={mod.href}
              className="group rounded-lg border border-slate-200 p-4 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <mod.icon className="h-6 w-6 text-primary-500 mb-2" />
              <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-600">
                {mod.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">{mod.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

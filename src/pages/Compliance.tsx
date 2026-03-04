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
  BookCheck,
  Search,
  Filter,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  FileDown,
} from "lucide-react"
import DataTable from "@/components/DataTable"
import StatusBadge from "@/components/StatusBadge"
import StatCard from "@/components/StatCard"
import { soes, complianceRecords } from "@/data/mock"
import { formatDate, cn } from "@/lib/utils"
import type { ComplianceRecord } from "@/lib/types"

export default function Compliance() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = complianceRecords.filter((cr) => {
    const soe = soes.find((s) => s.id === cr.soeId)
    const matchesSearch =
      !search || soe?.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || cr.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    published: complianceRecords.filter((c) => c.status === "published").length,
    submitted: complianceRecords.filter((c) => c.status === "submitted").length,
    overdue: complianceRecords.filter((c) => c.status === "overdue").length,
    notStarted: complianceRecords.filter(
      (c) => c.status === "not_started" || c.status === "draft"
    ).length,
  }

  const complianceRate = Math.round(
    (stats.published / complianceRecords.length) * 100
  )

  const statusChart = [
    { status: "Published", count: stats.published, color: "#22c55e" },
    { status: "Submitted", count: stats.submitted, color: "#3b82f6" },
    { status: "Overdue", count: stats.overdue, color: "#ef4444" },
    { status: "Draft/Not Started", count: stats.notStarted, color: "#94a3b8" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Annual Report Compliance Tracker
          </h1>
          <p className="text-sm text-slate-500">
            Track annual report submissions, publications, and public disclosure
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Bell className="h-4 w-4" />
            Send Reminders
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
            <FileDown className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Published"
          value={stats.published}
          subtitle={`${complianceRate}% compliance rate`}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Submitted"
          value={stats.submitted}
          subtitle="awaiting publication"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          subtitle="past due date"
          icon={<AlertTriangle className="h-5 w-5" />}
          className="border-red-200"
        />
        <StatCard
          label="Not Started"
          value={stats.notStarted}
          subtitle="draft or pending"
          icon={<BookCheck className="h-5 w-5" />}
        />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Compliance Status Distribution — FY 2024
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {complianceRecords.length} entities tracked
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar dataKey="count" name="Entities" radius={[4, 4, 0, 0]}>
              {statusChart.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compliance pipeline */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Compliance Pipeline
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: "Not Started", count: stats.notStarted, color: "bg-slate-200" },
            { label: "Board Approved", count: complianceRecords.filter((c) => c.status === "board_approved").length, color: "bg-indigo-200" },
            { label: "Submitted", count: stats.submitted, color: "bg-blue-200" },
            { label: "Published", count: stats.published, color: "bg-emerald-200" },
          ].map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2">
              {i > 0 && (
                <div className="h-px w-8 bg-slate-300" />
              )}
              <div className={cn("rounded-lg px-4 py-3 text-center min-w-[120px]", stage.color)}>
                <p className="text-lg font-bold text-slate-900">{stage.count}</p>
                <p className="text-xs text-slate-600">{stage.label}</p>
              </div>
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
            placeholder="Search entities..."
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
            <option value="published">Published</option>
            <option value="submitted">Submitted</option>
            <option value="board_approved">Board Approved</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
            <option value="not_started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable<ComplianceRecord>
        keyFn={(c) => c.id}
        data={filtered}
        columns={[
          {
            key: "soe",
            header: "SOE",
            render: (c) => {
              const soe = soes.find((s) => s.id === c.soeId)
              return (
                <div>
                  <p className="font-medium text-slate-900">{soe?.name}</p>
                  <p className="text-xs text-slate-500">{soe?.sector}</p>
                </div>
              )
            },
          },
          { key: "year", header: "FY", render: (c) => c.year },
          {
            key: "fyEnd",
            header: "FY End",
            render: (c) => formatDate(c.financialYearEnd),
          },
          {
            key: "due",
            header: "Due Date",
            render: (c) => formatDate(c.dueDate),
          },
          {
            key: "status",
            header: "Status",
            render: (c) => <StatusBadge status={c.status} />,
          },
          {
            key: "boardApproval",
            header: "Board Approval",
            render: (c) =>
              c.boardApprovalDate ? (
                <span className="text-emerald-600 text-xs">
                  {formatDate(c.boardApprovalDate)}
                </span>
              ) : (
                <span className="text-slate-400 text-xs">Pending</span>
              ),
          },
          {
            key: "submission",
            header: "Submitted",
            render: (c) =>
              c.submissionDate ? (
                <span className="text-xs">{formatDate(c.submissionDate)}</span>
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              ),
          },
          {
            key: "publication",
            header: "Published",
            render: (c) =>
              c.publicationUrl ? (
                <a
                  href={c.publicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-500 hover:underline"
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              ),
          },
        ]}
      />

      {/* Public Disclosure */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-emerald-900 mb-2">
          Public Disclosure Hub
        </h3>
        <p className="text-xs text-emerald-700 mb-4">
          Published annual reports accessible to Parliament, media, and the public
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {complianceRecords
            .filter((c) => c.status === "published")
            .map((c) => {
              const soe = soes.find((s) => s.id === c.soeId)
              return (
                <div
                  key={c.id}
                  className="rounded-lg bg-white border border-emerald-200 p-3"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {soe?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    FY {c.year} — Published{" "}
                    {c.publicationDate && formatDate(c.publicationDate)}
                  </p>
                  {c.publicationUrl && (
                    <a
                      href={c.publicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                    >
                      Access Report <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

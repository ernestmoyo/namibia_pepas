import { useState } from "react"
import {
  FileText,
  Search,
  Filter,
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import DataTable from "@/components/DataTable"
import StatusBadge from "@/components/StatusBadge"
import {
  soes,
  governanceAgreements,
  kpiDefinitions,
  kpiAssignments,
} from "@/data/mock"
import { formatDate, cn } from "@/lib/utils"
import type { GovernanceAgreement, KPIDefinition } from "@/lib/types"

type Tab = "agreements" | "kpi-library"

export default function Contracts() {
  const [tab, setTab] = useState<Tab>("agreements")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredAgreements = governanceAgreements.filter((ga) => {
    const soe = soes.find((s) => s.id === ga.soeId)
    const matchesSearch =
      !search ||
      soe?.name.toLowerCase().includes(search.toLowerCase()) ||
      ga.period.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || ga.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredKPIs = kpiDefinitions.filter((kpi) => {
    const matchesSearch =
      !search ||
      kpi.name.toLowerCase().includes(search.toLowerCase()) ||
      kpi.formula.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || kpi.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const agreementStats = {
    active: governanceAgreements.filter((g) => g.status === "active").length,
    draft: governanceAgreements.filter((g) => g.status === "draft").length,
    review: governanceAgreements.filter((g) => g.status === "review").length,
    expired: governanceAgreements.filter((g) => g.status === "expired").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Performance Contracts & KPI Library
          </h1>
          <p className="text-sm text-slate-500">
            Digitized governance agreements and standardized KPI catalog
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" />
          New Agreement
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active", value: agreementStats.active, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "In Review", value: agreementStats.review, icon: Clock, color: "text-blue-600" },
          { label: "Draft", value: agreementStats.draft, icon: FileText, color: "text-slate-600" },
          { label: "Expired", value: agreementStats.expired, icon: AlertCircle, color: "text-orange-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
            </div>
            <p className={cn("mt-1 text-2xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {([
          { key: "agreements", label: "Governance Agreements", icon: FileText },
          { key: "kpi-library", label: "KPI Library", icon: BookOpen },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(""); }}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={tab === "agreements" ? "Search agreements..." : "Search KPIs..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
        {tab === "agreements" ? (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-400 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="review">In Review</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-400 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="service_delivery">Service Delivery</option>
              <option value="governance">Governance</option>
              <option value="development">Development</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === "agreements" ? (
        <DataTable<GovernanceAgreement>
          keyFn={(g) => g.id}
          data={filteredAgreements}
          columns={[
            {
              key: "soe",
              header: "SOE",
              render: (g) => {
                const soe = soes.find((s) => s.id === g.soeId)
                return (
                  <div>
                    <p className="font-medium text-slate-900">{soe?.name}</p>
                    <p className="text-xs text-slate-500">{soe?.sector}</p>
                  </div>
                )
              },
            },
            { key: "period", header: "Period", render: (g) => g.period },
            {
              key: "status",
              header: "Status",
              render: (g) => <StatusBadge status={g.status} />,
            },
            { key: "kpis", header: "KPIs", render: (g) => g.kpiCount },
            { key: "clauses", header: "Clauses", render: (g) => g.clauses },
            {
              key: "version",
              header: "Version",
              render: (g) => `v${g.version}`,
            },
            {
              key: "approved",
              header: "Approved",
              render: (g) =>
                g.approvedAt ? formatDate(g.approvedAt) : "—",
            },
            {
              key: "signatories",
              header: "Signatories",
              render: (g) =>
                g.signatories.length > 0
                  ? g.signatories.join(", ")
                  : "Not yet assigned",
              className: "max-w-[200px] truncate",
            },
          ]}
        />
      ) : (
        <DataTable<KPIDefinition>
          keyFn={(k) => k.id}
          data={filteredKPIs}
          columns={[
            {
              key: "name",
              header: "KPI Name",
              render: (k) => (
                <p className="font-medium text-slate-900">{k.name}</p>
              ),
            },
            {
              key: "category",
              header: "Category",
              render: (k) => (
                <StatusBadge status={k.category} />
              ),
            },
            {
              key: "formula",
              header: "Formula",
              render: (k) => (
                <span className="text-xs text-slate-600">{k.formula}</span>
              ),
              className: "max-w-[250px]",
            },
            { key: "unit", header: "Unit", render: (k) => k.unit },
            { key: "frequency", header: "Frequency", render: (k) => k.frequency },
            {
              key: "bsc",
              header: "BSC Dimension",
              render: (k) => (
                <span className="text-xs capitalize">
                  {k.bscDimension.replace(/_/g, " ")}
                </span>
              ),
            },
            {
              key: "assignments",
              header: "Assigned",
              render: (k) => {
                const count = kpiAssignments.filter(
                  (a) => a.kpiId === k.id
                ).length
                return (
                  <span className="text-xs font-medium">{count} SOEs</span>
                )
              },
            },
          ]}
        />
      )}
    </div>
  )
}

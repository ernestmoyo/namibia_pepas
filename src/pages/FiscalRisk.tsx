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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import {
  ShieldAlert,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  FileDown,
  Search,
} from "lucide-react"
import StatCard from "@/components/StatCard"
import RiskBadge from "@/components/RiskBadge"
import DataTable from "@/components/DataTable"
import { soes, fiscalIndicators } from "@/data/mock"
import { formatCurrency, cn } from "@/lib/utils"
export default function FiscalRisk() {
  const [search, setSearch] = useState("")
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)

  const totalGuarantees = soes.reduce((s, e) => s + e.guaranteeExposure, 0)
  const totalSubsidies = soes.reduce((s, e) => s + e.subsidyAllocation, 0)
  const totalLiabilities = soes.reduce((s, e) => s + e.totalLiabilities, 0)
  const criticalCount = soes.filter((s) => s.riskTier === "critical").length
  const highCount = soes.filter((s) => s.riskTier === "high").length

  const enriched = fiscalIndicators.map((fi) => {
    const soe = soes.find((s) => s.id === fi.soeId)!
    return { ...fi, soeName: soe.name, riskTier: soe.riskTier }
  })

  const filtered = enriched.filter(
    (fi) =>
      !search || fi.soeName.toLowerCase().includes(search.toLowerCase())
  )

  const selectedFI = selectedEntity
    ? enriched.find((fi) => fi.soeId === selectedEntity)
    : null

  const radarData = selectedFI
    ? [
        { metric: "Liquidity", value: Math.min(selectedFI.liquidityRunway * 10, 100), fullMark: 100 },
        { metric: "Low Arrears", value: Math.max(100 - selectedFI.arrearsRatio * 200, 0), fullMark: 100 },
        { metric: "Op Margin", value: Math.max(selectedFI.operatingMargin * 3, 0), fullMark: 100 },
        { metric: "Debt Coverage", value: Math.min(selectedFI.debtServiceCoverage * 25, 100), fullMark: 100 },
        { metric: "Low Subsidy Dep", value: Math.max(100 - selectedFI.subsidyDependency * 2, 0), fullMark: 100 },
      ]
    : []

  const guaranteeData = soes
    .filter((s) => s.guaranteeExposure > 0)
    .sort((a, b) => b.guaranteeExposure - a.guaranteeExposure)
    .map((s) => ({
      name: s.acronym || s.name.slice(0, 10),
      exposure: s.guaranteeExposure / 1_000_000_000,
      riskTier: s.riskTier,
    }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            SOE Fiscal Risk Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Early warning indicators, risk tiers, and fiscal exposure — Treasury/OPM view
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
          <FileDown className="h-4 w-4" />
          Export Briefing Pack
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Guarantees"
          value={formatCurrency(totalGuarantees)}
          subtitle="government exposure"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Total Subsidies"
          value={formatCurrency(totalSubsidies)}
          subtitle="FY 2025/26 allocation"
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <StatCard
          label="Total Liabilities"
          value={formatCurrency(totalLiabilities)}
          subtitle="across portfolio"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="High/Critical Risk"
          value={`${criticalCount + highCount}`}
          subtitle={`${criticalCount} critical, ${highCount} high`}
          icon={<ShieldAlert className="h-5 w-5" />}
          className="border-red-200"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Guarantee Exposure */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Government Guarantee Exposure (N$ Billion)
          </h3>
          <p className="text-xs text-slate-500 mb-4">By entity</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={guaranteeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(value) => [`N$${Number(value).toFixed(1)}B`, "Exposure"]}
              />
              <Bar dataKey="exposure" name="Guarantee (N$B)" radius={[4, 4, 0, 0]}>
                {guaranteeData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.riskTier === "critical"
                        ? "#ef4444"
                        : entry.riskTier === "high"
                          ? "#f97316"
                          : entry.riskTier === "medium"
                            ? "#f59e0b"
                            : "#22c55e"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Entity Risk Profile (Radar) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Entity Risk Profile
          </h3>
          <p className="text-xs text-slate-500 mb-2">Select an entity to view its fiscal profile</p>
          <select
            value={selectedEntity ?? ""}
            onChange={(e) => setSelectedEntity(e.target.value || null)}
            className="mb-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm w-full focus:border-primary-400 outline-none"
          >
            <option value="">Select an SOE...</option>
            {soes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {selectedFI ? (
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={80}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#003580"
                  fill="#003580"
                  fillOpacity={0.2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[230px] text-sm text-slate-400">
              Select an entity above
            </div>
          )}
        </div>
      </div>

      {/* Fiscal Indicators Table */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
        </div>

        <DataTable<typeof enriched[number]>
          keyFn={(fi) => fi.id}
          data={filtered}
          onRowClick={(fi) => setSelectedEntity(fi.soeId)}
          columns={[
            {
              key: "soe",
              header: "SOE",
              render: (fi) => (
                <div>
                  <p className="font-medium text-slate-900">{fi.soeName}</p>
                  <RiskBadge tier={fi.riskTier} />
                </div>
              ),
            },
            {
              key: "liquidity",
              header: "Liquidity Runway",
              render: (fi) => (
                <span
                  className={cn(
                    "font-medium",
                    fi.liquidityRunway < 3
                      ? "text-red-600"
                      : fi.liquidityRunway < 6
                        ? "text-amber-600"
                        : "text-emerald-600"
                  )}
                >
                  {fi.liquidityRunway.toFixed(1)} months
                </span>
              ),
            },
            {
              key: "arrears",
              header: "Arrears Ratio",
              render: (fi) => (
                <span
                  className={cn(
                    "font-medium",
                    fi.arrearsRatio > 0.2
                      ? "text-red-600"
                      : fi.arrearsRatio > 0.1
                        ? "text-amber-600"
                        : "text-emerald-600"
                  )}
                >
                  {(fi.arrearsRatio * 100).toFixed(0)}%
                </span>
              ),
            },
            {
              key: "margin",
              header: "Operating Margin",
              render: (fi) => (
                <span
                  className={cn(
                    "font-medium",
                    fi.operatingMargin < 0
                      ? "text-red-600"
                      : fi.operatingMargin < 10
                        ? "text-amber-600"
                        : "text-emerald-600"
                  )}
                >
                  {fi.operatingMargin.toFixed(1)}%
                </span>
              ),
            },
            {
              key: "dscr",
              header: "DSCR",
              render: (fi) => (
                <span
                  className={cn(
                    "font-medium",
                    fi.debtServiceCoverage < 1
                      ? "text-red-600"
                      : fi.debtServiceCoverage < 1.5
                        ? "text-amber-600"
                        : "text-emerald-600"
                  )}
                >
                  {fi.debtServiceCoverage.toFixed(1)}x
                </span>
              ),
            },
            {
              key: "guarantee",
              header: "Guarantee",
              render: (fi) =>
                fi.guaranteeExposure > 0
                  ? formatCurrency(fi.guaranteeExposure)
                  : "—",
            },
            {
              key: "subsidy",
              header: "Subsidy Dep.",
              render: (fi) =>
                fi.subsidyDependency > 0 ? (
                  <span
                    className={cn(
                      "font-medium",
                      fi.subsidyDependency > 30
                        ? "text-red-600"
                        : fi.subsidyDependency > 10
                          ? "text-amber-600"
                          : "text-emerald-600"
                    )}
                  >
                    {fi.subsidyDependency}%
                  </span>
                ) : (
                  "—"
                ),
            },
          ]}
        />
      </div>
    </div>
  )
}

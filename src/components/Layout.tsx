import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  TrendingDown,
  BookCheck,
  UserCheck,
  Menu,
  X,
  ChevronRight,
  Building2,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { soes } from "@/data/mock"
import NamibiaFlag from "@/components/NamibiaFlag"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Contracts & KPIs", href: "/contracts", icon: FileText },
  { name: "Quarterly Scorecards", href: "/scorecards", icon: BarChart3 },
  { name: "Fiscal Risk", href: "/fiscal-risk", icon: TrendingDown },
  { name: "Compliance Tracker", href: "/compliance", icon: BookCheck },
  { name: "Evaluations", href: "/evaluations", icon: UserCheck },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [soeDropdownOpen, setSoeDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 text-white transform transition-transform duration-200 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "linear-gradient(180deg, #003580 0%, #002456 60%, #009543 100%)",
        }}
      >
        {/* Namibia flag stripe at top */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#003580]" />
          <div className="flex-1 bg-[#c8102e]" />
          <div className="flex-1 bg-[#009543]" />
          <div className="flex-1 bg-[#FFD700]" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <NamibiaFlag width={40} height={26} />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold leading-tight tracking-wide">PEPAS</h1>
            <p className="text-[10px] text-white/60 leading-tight">
              Public Enterprises Performance<br />& Accountability System
            </p>
          </div>
          <button
            className="ml-auto lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SOE Quick Select */}
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <button
              onClick={() => setSoeDropdownOpen(!soeDropdownOpen)}
              className="w-full flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15 transition-colors"
            >
              <Building2 className="h-4 w-4 shrink-0 text-gold-500" />
              <span className="flex-1 text-left text-xs">Select SOE...</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", soeDropdownOpen && "rotate-180")} />
            </button>
            {soeDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-lg bg-primary-800 border border-white/10 shadow-xl max-h-64 overflow-y-auto z-50">
                {soes.map((soe) => (
                  <button
                    key={soe.id}
                    onClick={() => {
                      setSoeDropdownOpen(false)
                      navigate(`/fiscal-risk?soe=${soe.id}`)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors"
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        soe.riskTier === "low"
                          ? "bg-emerald-400"
                          : soe.riskTier === "medium"
                            ? "bg-amber-400"
                            : soe.riskTier === "high"
                              ? "bg-orange-400"
                              : "bg-red-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 font-medium truncate">{soe.name}</p>
                      <p className="text-white/40 text-[10px]">{soe.sector}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold tabular-nums",
                      soe.overallScore >= 80 ? "text-emerald-400" :
                      soe.overallScore >= 60 ? "text-amber-400" :
                      soe.overallScore >= 40 ? "text-orange-400" : "text-red-400"
                    )}>
                      {soe.overallScore}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-white/50" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Hoop Africa branding */}
        <div className="border-t border-white/10 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/hoop-africa-logo.png"
              alt="Hoop Africa"
              className="h-8 w-8 rounded-md object-contain bg-white/10 p-0.5"
            />
            <div>
              <p className="text-[10px] text-gold-500 font-semibold">Powered by Hoop Africa</p>
              <p className="text-[9px] text-white/40">Supporting Namibia's Development</p>
              <a href="mailto:info@hoopafrica.org" className="text-[9px] text-white/50 hover:text-white/80 transition-colors">info@hoopafrica.org</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <NamibiaFlag width={20} height={13} />
            <p className="text-[10px] text-white/40">
              Republic of Namibia — Office of the Prime Minister
            </p>
          </div>
          <p className="text-[10px] text-white/30 mt-1">v1.0 — March 2026</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top banner: Hoop Africa branding + flag stripe */}
        <div className="bg-primary-500 text-white">
          <div className="flex items-center justify-between px-4 sm:px-6 py-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/hoop-africa-logo.png"
                alt="Hoop Africa"
                className="h-8 w-8 rounded-md object-contain bg-white/10 p-0.5"
              />
              <div>
                <p className="text-xs font-semibold text-white">
                  Powered by <span className="text-gold-500">Hoop Africa</span>
                </p>
                <p className="text-[10px] text-white/50">Supporting Namibia's Development</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NamibiaFlag width={28} height={18} />
              <span className="hidden sm:inline text-[10px] text-white/50">
                Republic of Namibia
              </span>
            </div>
          </div>
          <div className="h-1 w-full flex">
            <div className="flex-1 bg-[#003580]" />
            <div className="flex-1 bg-[#c8102e]" />
            <div className="flex-1 bg-[#009543]" />
            <div className="flex-1 bg-[#FFD700]" />
          </div>
        </div>

        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 shadow-sm">
          <button
            className="text-slate-500 hover:text-slate-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {navigation.find(
                (n) =>
                  n.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(n.href)
              )?.name ?? "PEPAS"}
            </h2>
            <p className="text-[11px] text-slate-500">
              PEPAS — FY 2025/26
            </p>
          </div>

          <div className="flex-1" />

          {/* SOE dropdown in header */}
          <div className="hidden md:block relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/fiscal-risk?soe=${e.target.value}`)
                }
              }}
              defaultValue=""
              className="rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs focus:border-primary-400 outline-none appearance-none min-w-[180px]"
            >
              <option value="">Browse SOEs...</option>
              {soes.map((soe) => (
                <option key={soe.id} value={soe.id}>
                  {soe.name} ({soe.overallScore})
                </option>
              ))}
            </select>
            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <span className="hidden sm:inline text-xs text-slate-500">
            FY 2025/26 — Q3
          </span>
          <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
            OA
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/hoop-africa-logo.png"
                alt="Hoop Africa"
                className="h-7 w-7 rounded object-contain"
              />
              <div>
                <p className="text-xs font-medium text-slate-700">
                  Powered by <span className="text-primary-500 font-semibold">Hoop Africa</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Supporting Namibia's Development — <a href="mailto:info@hoopafrica.org" className="text-primary-500 hover:underline">info@hoopafrica.org</a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NamibiaFlag width={20} height={13} />
              <p className="text-[10px] text-slate-400">
                Republic of Namibia — PEPAS v1.0 — March 2026
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

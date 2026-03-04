export interface SOE {
  id: string
  name: string
  acronym: string
  sector: string
  lineMinistry: string
  category: "commercial" | "strategic" | "regulatory"
  riskTier: "low" | "medium" | "high" | "critical"
  totalAssets: number
  totalLiabilities: number
  employees: number
  guaranteeExposure: number
  subsidyAllocation: number
  annualReportStatus: "published" | "submitted" | "overdue" | "draft" | "not_started"
  contractStatus: "active" | "draft" | "expired" | "pending_approval"
  lastQuarterlySubmission: string | null
  overallScore: number
}

export interface KPIDefinition {
  id: string
  name: string
  category: "financial" | "service_delivery" | "governance" | "development"
  formula: string
  unit: string
  frequency: "monthly" | "quarterly" | "annual"
  dataSource: string
  bscDimension: "financial" | "customer" | "internal_process" | "learning_growth"
}

export interface KPIAssignment {
  id: string
  soeId: string
  kpiId: string
  targetQ1: number
  targetQ2: number
  targetQ3: number
  targetQ4: number
  actualQ1: number | null
  actualQ2: number | null
  actualQ3: number | null
  actualQ4: number | null
  status: "on_track" | "at_risk" | "off_track" | "not_reported"
}

export interface GovernanceAgreement {
  id: string
  soeId: string
  period: string
  status: "draft" | "review" | "approved" | "active" | "expired"
  signatories: string[]
  clauses: number
  kpiCount: number
  createdAt: string
  approvedAt: string | null
  version: number
}

export interface QuarterlySubmission {
  id: string
  soeId: string
  quarter: string
  year: number
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
  submittedAt: string | null
  overallScore: number
  evidenceCount: number
  actionsOpen: number
  actionsClosed: number
}

export interface FiscalIndicator {
  id: string
  soeId: string
  period: string
  liquidityRunway: number
  arrearsRatio: number
  operatingMargin: number
  debtServiceCoverage: number
  guaranteeExposure: number
  subsidyDependency: number
}

export interface ComplianceRecord {
  id: string
  soeId: string
  year: number
  financialYearEnd: string
  dueDate: string
  boardApprovalDate: string | null
  submissionDate: string | null
  publicationDate: string | null
  publicationUrl: string | null
  status: "published" | "submitted" | "board_approved" | "draft" | "overdue" | "not_started"
}

export interface EvaluationCycle {
  id: string
  soeId: string
  type: "board" | "ceo" | "executive"
  period: string
  status: "planned" | "in_progress" | "completed" | "cancelled"
  strategyScore: number | null
  financialScore: number | null
  governanceScore: number | null
  riskScore: number | null
  serviceScore: number | null
  overallScore: number | null
}

export interface CorrectiveAction {
  id: string
  soeId: string
  kpiAssignmentId: string
  description: string
  owner: string
  dueDate: string
  status: "open" | "in_progress" | "closed" | "overdue"
  escalationLevel: 0 | 1 | 2 | 3
}

export type RiskTier = "low" | "medium" | "high" | "critical"

export interface DashboardStats {
  totalSOEs: number
  activeContracts: number
  quarterlySubmissionRate: number
  complianceRate: number
  averageScore: number
  criticalRiskEntities: number
  openActions: number
  evaluationsCompleted: number
}

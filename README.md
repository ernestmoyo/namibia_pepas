# PEPAS — Public Enterprises Performance & Accountability System

**A digital platform for monitoring, evaluating, and strengthening accountability across Namibia's State-Owned Enterprises (SOEs).**

### [View Live Demo](https://namibia-pepas.vercel.app)

> **Note:** PEPAS currently runs on **simulated data** for demonstration purposes. The mock dataset includes 12 representative Namibian SOEs with realistic but fictional performance scores, financial indicators, and compliance records. In production, this will connect to live data feeds from SOE submissions and Treasury systems.

---

## About

PEPAS is a comprehensive monitoring and evaluation platform designed to operationalize SOE oversight in Namibia. It translates the requirements of the **Public Enterprises Governance Act (2019)** into practical digital workflows — standardized performance contracts, quarterly reporting, fiscal risk monitoring, compliance tracking, and outcome-based board evaluation.

Namibia's SOE portfolio comprises **81-98 entities** controlling assets worth approximately **N$120 billion (~40% of GDP)** and employing around **25,000 people**. Despite legislative requirements, no standardized M&E framework exists in practice. PEPAS fills that gap.

---

## Powered by Hoop Africa

PEPAS is developed by **[Hoop Africa Foundation](https://www.hoopafrica.org)** — an organization committed to supporting Namibia's development through evidence-based solutions.

**Website:** [www.hoopafrica.org](https://www.hoopafrica.org) | **Email:** info@hoopafrica.org | **Phone:** +264 81 302 2416

### From Research to Action

Hoop Africa conducted **deep diagnostic research** into the performance management landscape of Namibian SOEs. This wasn't a desk review — it involved direct engagement with the people inside these institutions:

- **Primary interviews** with executives, managers, audit, HR, legal, and operations teams across multiple SOEs including TransNamib, Telecom Namibia, and the Development Bank of Namibia
- **Identification of the governance gap** — while the 2019 Act requires performance measures, M&E frameworks, and governance agreements, these are **not operationalized in practice**. SOEs are tracking strategy with Excel spreadsheets and Gantt charts. Board evaluations are reduced to attendance records. Consequences for non-performance are absent.
- **Cross-referencing** with the JSA/JICA-sponsored M&E workshop that flagged the absence of monitoring and evaluation as a **national-level gap across the entire public sector**
- **Benchmarking** against international best practice — Ghana's SIGA model (where performance contracts scaled from 6 to 79 entities in 8 years), South Africa's GWMES/PMDS, the OECD SOE Guidelines (2024 revision), and World Bank SOE Reform frameworks

Having understood the bottlenecks — fragmented reporting, inconsistent KPIs, superficial board evaluation, fiscal risk blind spots, chronic non-compliance with annual reporting, and loss of institutional memory through repeated governance restructuring — **Hoop Africa is now going back with a solution**.

PEPAS is that dissemination. It transforms research findings into operational infrastructure. Instead of writing another report about what's broken, we built the tool to fix it. Every module in PEPAS maps directly to a gap identified during the research: the absence of standardized contracts, the lack of comparable quarterly data, the inability to see fiscal risk across the portfolio, the failure to track annual report compliance, and the superficiality of board evaluation.

This is not a theoretical framework. It is a **working platform** built from the ground up on real data, real interviews, and real understanding of what Namibian institutions need.

---

## Modules

### 1. Performance Contracts & KPI Library
Digitized governance agreements with a standardized KPI catalog aligned to NDP6, Vision 2030, HPP II, and Balanced Scorecard dimensions. Template-driven, versioned, with configurable approval workflows.

### 2. Quarterly Scorecard & Reporting Portal
Structured quarterly reporting replacing ad-hoc Excel/Gantt chart tracking. Evidence uploads, variance explanations, corrective action tracking with escalation levels, and exportable board packs.

### 3. SOE Fiscal Risk Dashboard
Treasury/OPM view of fiscal exposure — liquidity runway, arrears ratios, operating margins, debt service coverage, guarantee registers, and subsidy dependency. Risk tiers with early warning signals.

### 4. Annual Report Compliance Tracker
Compliance calendar, automated reminders, status pipeline (Draft > Board Approved > Submitted > Published), and a public disclosure hub for transparency.

### 5. Board & Executive Evaluation Tool
Outcome-based evaluation replacing superficial peer reviews. Five balanced dimensions: strategy delivery, financial stewardship, governance & compliance, risk management, and service & development outcomes.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router DOM |
| Hosting | [Vercel](https://namibia-pepas.vercel.app) |
| Data | Simulated (mock) — production will integrate live SOE data |

---

## Getting Started

```bash
# Clone
git clone https://github.com/ernestmoyo/namibia_pepas.git
cd namibia_pepas

# Install
npm install

# Dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
```

---

## Project Structure

```
src/
├── components/     # Shared UI (Layout, Gauge, DataTable, StatCard, etc.)
├── pages/          # Dashboard, Contracts, Scorecards, FiscalRisk, Compliance, Evaluations
├── data/           # Mock data (12 Namibian SOEs with realistic figures)
├── lib/            # Types, utilities, formatting helpers
└── index.css       # Tailwind config with Namibia flag color theme
```

---

## Context

- **Public Enterprises Governance Act 2019** requires performance measures, governance agreements, and annual reports — but these remain unimplemented in practice
- **SOE budget cuts >50%** in FY 2026/27 (subsidies slashed from N$1.3B to N$615.7M) signal a "perform or die" moment
- **The 2025 Amendment Bill** proposes centralizing all SOE oversight under the Office of the Prime Minister — creating urgent demand for standardized M&E tools to monitor 81+ entities
- **Ghana's SIGA model** (studied by a 16-member Namibian government delegation in Sept 2024) demonstrates that performance contracting at national scale is achievable

---

## License

Proprietary — Hoop Africa Foundation. All rights reserved.

---

*Built with purpose for Namibia by [Hoop Africa](https://www.hoopafrica.org)*

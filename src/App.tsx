import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import Dashboard from "@/pages/Dashboard"
import Contracts from "@/pages/Contracts"
import Scorecards from "@/pages/Scorecards"
import FiscalRisk from "@/pages/FiscalRisk"
import Compliance from "@/pages/Compliance"
import Evaluations from "@/pages/Evaluations"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/scorecards" element={<Scorecards />} />
          <Route path="/fiscal-risk" element={<FiscalRisk />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/evaluations" element={<Evaluations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

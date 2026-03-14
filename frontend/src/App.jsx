import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import SignInSignUp from './pages/SignInSignUp'
import DashboardLayout from './components/layout/DashboardLayout'
import ResearcherDashboard from './pages/ResearcherDashboard'
import DatasetUpload from './pages/DatasetUpload'
import DatasetComparison from './pages/DatasetComparison'
import GlobeView from './pages/GlobeView'
import ClimatePredictions from './pages/ClimatePredictions'
import StoryMode from './pages/StoryMode'
import ClimateNews from './pages/ClimateNews'
import ReportExport from './pages/ReportExport'
import PublicDashboard from './pages/PublicDashboard'
import ComponentSheet from './pages/ComponentSheet'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<SignInSignUp />} />
        </Route>

        {/* Protected dashboard routes — require login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ResearcherDashboard />} />
          <Route path="upload" element={<DatasetUpload />} />
          <Route path="compare" element={<DatasetComparison />} />
          <Route path="predictions" element={<ClimatePredictions />} />
          <Route path="stories" element={<StoryMode />} />
          <Route path="news" element={<ClimateNews />} />
          <Route path="reports" element={<ReportExport />} />
        </Route>

        {/* Fullscreen globe view (protected) */}
        <Route
          path="/dashboard/globe"
          element={
            <ProtectedRoute>
              <GlobeView />
            </ProtectedRoute>
          }
        />

        {/* Public user freemium route */}
        <Route path="/public" element={<PublicDashboard />} />

        {/* UI Component Kit */}
        <Route path="/components" element={<ComponentSheet />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

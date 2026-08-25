import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RootLayout } from '@components/layout/RootLayout'
import { RouteFallback } from './RouteFallback'
import { PATHS } from './paths'

// Home ships in the main bundle; everything else splits so the hero paints fast.
import HomePage from '@/pages/HomePage'

const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const BookingPage = lazy(() => import('@/pages/BookingPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const DataDeletionPage = lazy(() => import('@/pages/DataDeletionPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function pageRoutes() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route
        path="work"
        element={
          <Suspense fallback={<RouteFallback />}>
            <ProjectsPage />
          </Suspense>
        }
      />
      <Route
        path="work/:slug"
        element={
          <Suspense fallback={<RouteFallback />}>
            <ProjectDetailPage />
          </Suspense>
        }
      />
      <Route
        path="services"
        element={
          <Suspense fallback={<RouteFallback />}>
            <ServicesPage />
          </Suspense>
        }
      />
      <Route
        path="book"
        element={
          <Suspense fallback={<RouteFallback />}>
            <BookingPage />
          </Suspense>
        }
      />
      <Route
        path="about"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AboutPage />
          </Suspense>
        }
      />
      <Route
        path="privacy"
        element={
          <Suspense fallback={<RouteFallback />}>
            <PrivacyPage />
          </Suspense>
        }
      />
      <Route
        path="terms"
        element={
          <Suspense fallback={<RouteFallback />}>
            <TermsPage />
          </Suspense>
        }
      />
      <Route
        path="data-deletion"
        element={
          <Suspense fallback={<RouteFallback />}>
            <DataDeletionPage />
          </Suspense>
        }
      />
    </>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {pageRoutes()}
      </Route>
      <Route path="/ar" element={<RootLayout />}>
        {pageRoutes()}
      </Route>
      <Route element={<RootLayout />}>
        <Route
          path={PATHS.notFound}
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

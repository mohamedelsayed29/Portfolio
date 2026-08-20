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
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path={PATHS.work}
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProjectsPage />
            </Suspense>
          }
        />
        <Route
          path={PATHS.workDetail()}
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProjectDetailPage />
            </Suspense>
          }
        />
        <Route
          path={PATHS.services}
          element={
            <Suspense fallback={<RouteFallback />}>
              <ServicesPage />
            </Suspense>
          }
        />
        <Route
          path={PATHS.book}
          element={
            <Suspense fallback={<RouteFallback />}>
              <BookingPage />
            </Suspense>
          }
        />
        <Route
          path={PATHS.about}
          element={
            <Suspense fallback={<RouteFallback />}>
              <AboutPage />
            </Suspense>
          }
        />
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

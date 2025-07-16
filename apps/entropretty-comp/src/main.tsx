import "@/globals.css"

import { AuthProvider } from "@/contexts/auth-context.tsx"
import { ServiceProvider } from "@/contexts/service-context.tsx"
import HeaderLayout from "@/layouts/HeaderLayout.tsx"
import DemoPage from "@/routes/Demo.tsx"
import Login from "@/routes/Login.tsx"
import MinePage from "@/routes/Mine.tsx"
import NewPage from "@/routes/New"
import ExplorePage from "@/routes/Explore"
import Profile from "@/routes/Profile.tsx"
import SignUp from "@/routes/SignUp.tsx"
import UserPage from "@/routes/User.tsx"
import { Suspense, lazy } from "react"
import { HelmetProvider } from "react-helmet-async"

import ScrollToTop from "@/components/ScrollToTop"
import { Toaster } from "@/components/ui/sonner"
import RequireUser from "@/layouts/RequireUser"
import RequireUsername from "@/layouts/RequireUsername"
import AlgorithmPage from "@/routes/Algorithm"
import HotPage from "@/routes/Hot"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
const Create = lazy(() => import("@/routes/Create"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ServiceProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <ScrollToTop />
            <Routes>
              <Route path="/demo/:algorithmId" element={<DemoPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route element={<HeaderLayout />}>
                <Route path="/new" element={<NewPage />} />
                <Route path="/hot" element={<HotPage />} />

                <Route path="/" element={<NewPage />} />
                <Route path="/a/:algorithmId" element={<AlgorithmPage />} />
                <Route path="/u/:username" element={<UserPage />} />
                <Route element={<RequireUser />}>
                  <Route path="/mine" element={<MinePage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route element={<RequireUsername />}>
                    <Route
                      path="/create"
                      element={
                        <Suspense
                          fallback={
                            <div className="p-8">Loading editor...</div>
                          }
                        >
                          <Create />
                        </Suspense>
                      }
                    />
                  </Route>
                </Route>
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ServiceProvider>
    </QueryClientProvider>
  </HelmetProvider>,
)

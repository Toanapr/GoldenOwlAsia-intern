import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LoadingState } from "./components/ui/AsyncState";
import { DashboardPage } from "./pages/DashboardPage";

const SearchPage = lazy(() =>
  import("./pages/SearchPage").then((module) => ({
    default: module.SearchPage,
  })),
);
const ReportsPage = lazy(() =>
  import("./pages/ReportsPage").then((module) => ({
    default: module.ReportsPage,
  })),
);
const TopStudentsPage = lazy(() =>
  import("./pages/TopStudentsPage").then((module) => ({
    default: module.TopStudentsPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);

function PageSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>;
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="search"
          element={
            <PageSuspense>
              <SearchPage />
            </PageSuspense>
          }
        />
        <Route
          path="reports"
          element={
            <PageSuspense>
              <ReportsPage />
            </PageSuspense>
          }
        />
        <Route
          path="top-students"
          element={
            <PageSuspense>
              <TopStudentsPage />
            </PageSuspense>
          }
        />
        <Route
          path="*"
          element={
            <PageSuspense>
              <NotFoundPage />
            </PageSuspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

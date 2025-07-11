
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { StudentManagement } from "./components/Students/StudentManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="exams" element={<div className="p-8 text-center text-gray-500">Exam Management - Coming Soon</div>} />
            <Route path="scores" element={<div className="p-8 text-center text-gray-500">Score Entry - Coming Soon</div>} />
            <Route path="reports" element={<div className="p-8 text-center text-gray-500">Reports - Coming Soon</div>} />
            <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings - Coming Soon</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

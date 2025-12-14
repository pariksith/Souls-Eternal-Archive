import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { useDiaryStorage } from "@/hooks/useDiaryStorage";
import { EntriesSidebar } from "@/components/EntriesSidebar";

const queryClient = new QueryClient();

export default function App() {
  // 🔥 THIS IS THE IMPORTANT LINE
  const MASTER_PASSWORD = "test123";

const {
  entries,
  isLoading,
  addEntry,
  updateEntry,
  deleteEntry,
  getEntryByDate,
  toggleSeal,
} = useDiaryStorage(MASTER_PASSWORD);


  if (isLoading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <div className="flex h-screen">
            {/* Sidebar always mounted → IndexedDB always active */}
            <EntriesSidebar
              entries={entries}
              selectedDate={new Date()}
              onSelectDate={() => {}}
            />

            {/* Main content */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
}

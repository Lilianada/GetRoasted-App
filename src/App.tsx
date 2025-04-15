
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BattleLobby from "./pages/BattleLobby";
import BattlePage from "./pages/BattlePage";
import NewBattle from "./pages/NewBattle";
import BattleResults from "./pages/BattleResults";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Rules from "./pages/Rules";
import Leaderboard from "./pages/Leaderboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/battles" element={<BattleLobby />} />
          <Route path="/battle/new" element={<NewBattle />} />
          <Route path="/battle/:battleId" element={<BattlePage />} />
          <Route path="/battle/results/:battleId" element={<BattleResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

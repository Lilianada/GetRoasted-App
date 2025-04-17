
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SubscriptionProvider } from "./hooks/useSubscription";
import { AuthProvider } from "./context/AuthContext";
import { useAuthContext } from "./context/AuthContext";
import { SettingsProvider } from "./hooks/useSettings";
import Home from "./pages/Home";
import BattleLobby from "./pages/BattleLobby";
import BattlePage from "./pages/BattlePage";
import Battle from "./pages/Battle";
import NewBattle from "./pages/NewBattle";
import BattleResults from "./pages/BattleResults";
import BattleWaitingRoom from "./pages/BattleWaitingRoom";
import JoinBattle from "./pages/JoinBattle";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Rules from "./pages/Rules";
import Leaderboard from "./pages/Leaderboard";
import Billing from "./pages/Billing";
import SocketStatus from "./components/SocketStatus";

const queryClient = new QueryClient();

// Component to handle protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-night">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Protected routes */}
                <Route path="/battles" element={
                  <ProtectedRoute>
                    <BattleLobby />
                  </ProtectedRoute>
                } />
                <Route path="/battle/new" element={
                  <ProtectedRoute>
                    <NewBattle />
                  </ProtectedRoute>
                } />
                <Route path="/battle/live/:battleId" element={
                  <ProtectedRoute>
                    <Battle />
                  </ProtectedRoute>
                } />
                <Route path="/battle/:battleId" element={
                  <ProtectedRoute>
                    <BattlePage />
                  </ProtectedRoute>
                } />
                <Route path="/battle/join/:battleId" element={
                  <ProtectedRoute>
                    <JoinBattle />
                  </ProtectedRoute>
                } />
                <Route path="/battle/waiting/:battleId" element={
                  <ProtectedRoute>
                    <BattleWaitingRoom />
                  </ProtectedRoute>
                } />
                <Route path="/battle/results/:battleId" element={
                  <ProtectedRoute>
                    <BattleResults />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/profile/:username" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/billing" element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/rules" element={
                  <ProtectedRoute>
                    <Rules />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <SocketStatus connected={true} />
          </TooltipProvider>
        </SubscriptionProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

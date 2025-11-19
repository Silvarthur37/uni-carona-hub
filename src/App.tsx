import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateRide from "./pages/CreateRide";
import SearchRides from "./pages/SearchRides";
import MyRides from "./pages/MyRides";
import RideDetails from "./pages/RideDetails";
import PrivateChat from "./pages/PrivateChat";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Ranking from "./pages/Ranking";
import Map from "./pages/Map";
import Favorites from "./pages/Favorites";
import UsersList from "./pages/UsersList";
import NearbyDrivers from "./pages/NearbyDrivers";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-ride" element={<CreateRide />} />
          <Route path="/search-rides" element={<SearchRides />} />
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/ride/:id" element={<RideDetails />} />
          <Route path="/chat/:userId" element={<PrivateChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/map" element={<Map />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/nearby-drivers" element={<NearbyDrivers />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/install" element={<Install />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

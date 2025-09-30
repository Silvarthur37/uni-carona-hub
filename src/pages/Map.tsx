import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

const Map = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    checkUser();
    getUserLocation();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 bg-background/95 backdrop-blur">
        <div className="relative max-w-screen-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Para onde vamos?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base rounded-full bg-muted/50"
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="pt-20 px-4">
        <Card className="w-full h-[calc(100vh-12rem)] bg-muted/30 flex items-center justify-center relative overflow-hidden">
          {/* Placeholder for actual map implementation */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          
          <div className="relative z-10 text-center space-y-4 p-6">
            <MapPin className="h-16 w-16 mx-auto text-primary" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Mapa em Desenvolvimento</h2>
              <p className="text-muted-foreground max-w-md">
                {userLocation
                  ? `Sua localização: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                  : "Permitir acesso à localização para ver o mapa"}
              </p>
            </div>
          </div>

          {/* Location Marker */}
          {userLocation && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
              <Card className="p-3 bg-background shadow-lg">
                <p className="text-sm font-medium">
                  Você está aqui (com precisão de 18 metros)
                </p>
              </Card>
            </div>
          )}
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Map;

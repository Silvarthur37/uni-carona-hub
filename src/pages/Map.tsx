import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Map = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    checkUser();
    initializeMap();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialize map centered on Brazil
    const map = L.map(mapContainer.current).setView([-14.235, -51.925], 4);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    // Get user location and add marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Center map on user location
          map.setView([latitude, longitude], 13);
          
          // Add marker for user location
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("Você está aqui!")
            .openPopup();
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
      <div className="pt-20 px-4 pb-4">
        <div 
          ref={mapContainer} 
          className="w-full h-[calc(100vh-12rem)] rounded-lg shadow-lg"
          style={{ minHeight: '500px' }}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Map;

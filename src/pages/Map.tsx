import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation, MapPin, Route as RouteIcon, Loader2, Users } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type Location = {
  lat: number;
  lng: number;
  name: string;
};

const Map = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originLocation, setOriginLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; price: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.Polyline | null>(null);
  const originMarker = useRef<L.Marker | null>(null);
  const destinationMarker = useRef<L.Marker | null>(null);

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
          const userIcon = L.divIcon({
            className: "custom-user-marker",
            html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          });
          
          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup("Você está aqui!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Erro",
            description: "Não foi possível obter sua localização",
            variant: "destructive",
          });
        }
      );
    }
  };

  const searchLocation = async (query: string): Promise<Location | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name,
        };
      }
      return null;
    } catch (error) {
      console.error("Error searching location:", error);
      return null;
    }
  };

  const calculateRoute = async () => {
    if (!originLocation || !destinationLocation || !mapInstance.current) return;

    setLoading(true);
    try {
      // Use OSRM for route calculation
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${originLocation.lng},${originLocation.lat};${destinationLocation.lng},${destinationLocation.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;
        
        // Convert coordinates to Leaflet format [lat, lng]
        const latLngs = coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

        // Remove old route if exists
        if (routeLayer.current) {
          mapInstance.current.removeLayer(routeLayer.current);
        }

        // Draw new route
        routeLayer.current = L.polyline(latLngs, {
          color: "#3b82f6",
          weight: 5,
          opacity: 0.7,
        }).addTo(mapInstance.current);

        // Add markers
        const greenIcon = L.icon({
          iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const redIcon = L.icon({
          iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        if (originMarker.current) {
          mapInstance.current.removeLayer(originMarker.current);
        }
        if (destinationMarker.current) {
          mapInstance.current.removeLayer(destinationMarker.current);
        }

        originMarker.current = L.marker([originLocation.lat, originLocation.lng], { icon: greenIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>Origem:</b><br>${origin}`);

        destinationMarker.current = L.marker([destinationLocation.lat, destinationLocation.lng], { icon: redIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>Destino:</b><br>${destination}`);

        // Fit map to route
        mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [50, 50] });

        // Calculate route info
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.round(route.duration / 60);
        const priceEstimate = (parseFloat(distanceKm) * 1.5).toFixed(2); // R$1.50 per km

        setRouteInfo({
          distance: `${distanceKm} km`,
          duration: `${durationMin} min`,
          price: `R$ ${priceEstimate}`,
        });

        toast({
          title: "Rota calculada!",
          description: `Distância: ${distanceKm} km - Tempo: ${durationMin} min`,
        });
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      toast({
        title: "Erro",
        description: "Não foi possível calcular a rota",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOrigin = async () => {
    if (!origin.trim()) return;
    setLoading(true);
    const location = await searchLocation(origin);
    if (location) {
      setOriginLocation(location);
      toast({
        title: "Origem encontrada",
        description: location.name,
      });
    } else {
      toast({
        title: "Erro",
        description: "Localização não encontrada",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSearchDestination = async () => {
    if (!destination.trim()) return;
    setLoading(true);
    const location = await searchLocation(destination);
    if (location) {
      setDestinationLocation(location);
      toast({
        title: "Destino encontrado",
        description: location.name,
      });
    } else {
      toast({
        title: "Erro",
        description: "Localização não encontrada",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setOriginLocation({
        lat: userLocation.lat,
        lng: userLocation.lng,
        name: "Sua localização atual",
      });
      setOrigin("Sua localização atual");
      toast({
        title: "Localização definida",
        description: "Usando sua localização atual como origem",
      });
    } else {
      toast({
        title: "Erro",
        description: "Localização não disponível",
        variant: "destructive",
      });
    }
  };

  const handleFindNearbyDrivers = () => {
    if (destinationLocation) {
      navigate(
        `/nearby-drivers?lat=${destinationLocation.lat}&lng=${destinationLocation.lng}&destination=${encodeURIComponent(
          destinationLocation.name
        )}`
      );
    }
  };

  useEffect(() => {
    if (originLocation && destinationLocation) {
      calculateRoute();
    }
  }, [originLocation, destinationLocation]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Controls */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-screen-xl mx-auto p-4 space-y-3">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <RouteIcon className="w-5 h-5" />
            Calcular Rota
          </h1>

          {/* Origin */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
              <Input
                type="text"
                placeholder="Origem"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchOrigin()}
                className="pl-10"
              />
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleUseCurrentLocation}
              title="Usar localização atual"
            >
              <Navigation className="w-4 h-4" />
            </Button>
            <Button onClick={handleSearchOrigin} disabled={loading || !origin.trim()}>
              Buscar
            </Button>
          </div>

          {/* Destination */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 h-4 w-4" />
              <Input
                type="text"
                placeholder="Destino"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchDestination()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearchDestination} disabled={loading || !destination.trim()}>
              Buscar
            </Button>
          </div>

          {/* Route Info */}
          {routeInfo && (
            <Card className="p-3 bg-card/80 space-y-3">
              <div className="flex justify-around text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Distância</p>
                  <p className="font-bold">{routeInfo.distance}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Tempo</p>
                  <p className="font-bold">{routeInfo.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Preço Est.</p>
                  <p className="font-bold text-primary">{routeInfo.price}</p>
                </div>
              </div>
              <Button
                onClick={handleFindNearbyDrivers}
                className="w-full"
                variant="default"
                size="sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Buscar Motoristas Próximos
              </Button>
            </Card>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculando...
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="pt-[280px] px-4">
        <div 
          ref={mapContainer} 
          className="w-full h-[calc(100vh-380px)] rounded-lg shadow-lg border border-border"
          style={{ minHeight: '400px' }}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Map;

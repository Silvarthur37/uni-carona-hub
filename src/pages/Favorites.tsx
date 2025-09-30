import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Home, Briefcase, MapPin, Trash2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type FavoriteLocation = {
  id: string;
  name: string;
  address: string;
  icon: string;
};

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFavorite, setNewFavorite] = useState({
    name: "",
    address: "",
    icon: "home",
  });

  useEffect(() => {
    checkUser();
    fetchFavorites();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("favorite_locations")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    if (!newFavorite.name || !newFavorite.address) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("favorite_locations").insert({
        user_id: user.id,
        name: newFavorite.name,
        address: newFavorite.address,
        icon: newFavorite.icon,
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Favorito adicionado!",
      });

      setDialogOpen(false);
      setNewFavorite({ name: "", address: "", icon: "home" });
      fetchFavorites();
    } catch (error) {
      console.error("Error adding favorite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o favorito",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from("favorite_locations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Favorito removido",
      });

      fetchFavorites();
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "briefcase":
        return <Briefcase className="h-6 w-6 text-primary" />;
      case "home":
        return <Home className="h-6 w-6 text-primary" />;
      default:
        return <MapPin className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Favoritos</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 h-14 text-lg" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Novo Favorito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Local Favorito</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Local</Label>
                <Input
                  id="name"
                  placeholder="Ex: Casa, Trabalho"
                  value={newFavorite.name}
                  onChange={(e) =>
                    setNewFavorite({ ...newFavorite, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Ex: Rua das Flores, 123"
                  value={newFavorite.address}
                  onChange={(e) =>
                    setNewFavorite({ ...newFavorite, address: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <select
                  id="icon"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newFavorite.icon}
                  onChange={(e) =>
                    setNewFavorite({ ...newFavorite, icon: e.target.value })
                  }
                >
                  <option value="home">Casa</option>
                  <option value="briefcase">Trabalho</option>
                  <option value="map-pin">Outro</option>
                </select>
              </div>
              <Button onClick={handleAddFavorite} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Carregando...</p>
          ) : favorites.length === 0 ? (
            <Card className="p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum favorito adicionado ainda
              </p>
            </Card>
          ) : (
            favorites.map((favorite) => (
              <Card key={favorite.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getIcon(favorite.icon)}
                    <div>
                      <h3 className="font-semibold text-lg">{favorite.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {favorite.address}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFavorite(favorite.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Favorites;

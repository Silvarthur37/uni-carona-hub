import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [course, setCourse] = useState("");
  const [university, setUniversity] = useState("");
  const [phone, setPhone] = useState("");
  const [hobbiesText, setHobbiesText] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homeAddressSearch, setHomeAddressSearch] = useState("");
  const [homeLat, setHomeLat] = useState<number | null>(null);
  const [homeLng, setHomeLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      setFullName(profile.full_name || "");
      setCourse(profile.course || "");
      setUniversity(profile.university || "");
      setPhone(profile.phone || "");
      setHobbiesText(profile.hobbies ? profile.hobbies.join(", ") : "");
      setHomeAddress(profile.home_address || "");
      setHomeAddressSearch(profile.home_address || "");
      setHomeLat(profile.home_lat ? Number(profile.home_lat) : null);
      setHomeLng(profile.home_lng ? Number(profile.home_lng) : null);
    }

    setLoading(false);
  };

  const searchHomeAddress = async () => {
    if (!homeAddressSearch.trim()) return;
    
    setSearchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          homeAddressSearch
        )}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setHomeAddress(data[0].display_name);
        setHomeLat(parseFloat(data[0].lat));
        setHomeLng(parseFloat(data[0].lon));
        toast({
          title: "Endereço encontrado!",
          description: "Localização definida com sucesso.",
        });
      } else {
        toast({
          title: "Endereço não encontrado",
          description: "Tente um endereço mais específico.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching address:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar o endereço.",
        variant: "destructive",
      });
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const hobbiesArray = hobbiesText
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          course,
          university,
          phone,
          hobbies: hobbiesArray,
          home_address: homeAddress,
          home_lat: homeLat,
          home_lng: homeLng,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Editar Perfil</h1>
        </div>

        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Seu curso"
              />
            </div>

            <div>
              <Label htmlFor="university">Universidade</Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Sua universidade"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Seu telefone"
              />
            </div>

            <div>
              <Label htmlFor="hobbies">Hobbies (separados por vírgula)</Label>
              <Input
                id="hobbies"
                value={hobbiesText}
                onChange={(e) => setHobbiesText(e.target.value)}
                placeholder="Ex: Leitura, Música, Esportes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeAddress">Endereço Residencial</Label>
              <div className="flex gap-2">
                <Input
                  id="homeAddress"
                  value={homeAddressSearch}
                  onChange={(e) => setHomeAddressSearch(e.target.value)}
                  placeholder="Digite seu endereço completo"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={searchHomeAddress}
                  disabled={searchingAddress || !homeAddressSearch.trim()}
                  variant="secondary"
                >
                  {searchingAddress ? "Buscando..." : "Buscar"}
                </Button>
              </div>
              {homeAddress && (
                <p className="text-sm text-muted-foreground">
                  Endereço salvo: {homeAddress}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEdit;

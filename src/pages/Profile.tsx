import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Save } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    course: "",
    university: "",
    phone: "",
    hobbies: [] as string[],
  });
  const [hobbiesText, setHobbiesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          course: profileData.course || "",
          university: profileData.university || "",
          phone: profileData.phone || "",
          hobbies: profileData.hobbies || [],
        });
        setHobbiesText((profileData.hobbies || []).join(", "));
      }
    } catch (error: any) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const hobbiesArray = hobbiesText
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          course: profile.course,
          university: profile.university,
          phone: profile.phone,
          hobbies: hobbiesArray,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">Meu Perfil</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold">
              {profile.full_name?.charAt(0) || "?"}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                required
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                value={profile.course}
                onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                placeholder="Ex: Engenharia de Computação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">Universidade</Label>
              <Input
                id="university"
                value={profile.university}
                onChange={(e) =>
                  setProfile({ ...profile, university: e.target.value })
                }
                placeholder="Ex: UFMG"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="(31) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies</Label>
              <Textarea
                id="hobbies"
                value={hobbiesText}
                onChange={(e) => setHobbiesText(e.target.value)}
                placeholder="Música, esportes, jogos... (separe por vírgula)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Ajude seus colegas a conhecerem você melhor!
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="hero"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

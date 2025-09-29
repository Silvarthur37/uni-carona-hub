import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Car, MapPin, Calendar, Users, DollarSign } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const CreateRide = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureTime: "",
    availableSeats: 1,
    price: "",
    description: "",
    isRecurring: false,
    recurringDays: [] as number[],
  });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("rides").insert({
        driver_id: user.id,
        origin: formData.origin,
        destination: formData.destination,
        departure_time: new Date(formData.departureTime).toISOString(),
        available_seats: formData.availableSeats,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description,
        is_recurring: formData.isRecurring,
        recurring_days: formData.isRecurring ? formData.recurringDays : null,
        status: "pendente",
      });

      if (error) throw error;

      toast({
        title: "Carona criada!",
        description: "Aguarde passageiros solicitarem",
      });

      navigate("/my-rides");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRecurringDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter((d) => d !== day)
        : [...prev.recurringDays, day],
    }));
  };

  const weekDays = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">Oferecer Carona</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="origin">
                <MapPin className="w-4 h-4 inline mr-2" />
                Origem
              </Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
                placeholder="Ex: Portaria Principal UFMG"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">
                <MapPin className="w-4 h-4 inline mr-2" />
                Destino
              </Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Ex: Shopping Cidade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureTime">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data e Hora
              </Label>
              <Input
                id="departureTime"
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableSeats">
                  <Users className="w-4 h-4 inline mr-2" />
                  Vagas
                </Label>
                <Input
                  id="availableSeats"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.availableSeats}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableSeats: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Preço (opcional)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="R$ 0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Informações adicionais sobre a carona..."
                rows={3}
              />
            </div>

            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRecurring: checked as boolean })
                  }
                />
                <Label htmlFor="isRecurring" className="cursor-pointer">
                  Carona recorrente (toda semana)
                </Label>
              </div>

              {formData.isRecurring && (
                <div className="space-y-2">
                  <Label>Dias da semana:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekDays.map((day, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox
                          id={`day-${index}`}
                          checked={formData.recurringDays.includes(index)}
                          onCheckedChange={() => toggleRecurringDay(index)}
                        />
                        <Label htmlFor={`day-${index}`} className="cursor-pointer">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" variant="hero" disabled={loading}>
              {loading ? "Criando..." : "Criar Carona"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRide;

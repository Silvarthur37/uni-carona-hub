import { NavLink } from "react-router-dom";
import { MapPin, Car, User, MessageSquare } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/map", icon: MapPin, label: "Mapa" },
    { to: "/dashboard", icon: Car, label: "Caronas" },
    { to: "/users", icon: MessageSquare, label: "Chat" },
    { to: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-6 w-6 ${isActive ? "fill-primary" : ""}`}
                />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

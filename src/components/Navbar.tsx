import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogIn, Moon, Sun, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";

interface User {
  fullName?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
}

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
    // Listen for storage changes (e.g., login/logout in other tabs)
    const onStorage = () => {
      const updated = localStorage.getItem('user');
      setUser(updated ? JSON.parse(updated) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-primary">CareerBridge</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#jobs" className="text-foreground hover:text-primary transition-smooth">
            Jobs
          </a>
          <a href="#companies" className="text-foreground hover:text-primary transition-smooth">
            Companies
          </a>
          <a href="#about" className="text-foreground hover:text-primary transition-smooth">
            About
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <>
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-background"></span>
              </Button>

              {/* User Profile */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl || "/placeholder-avatar.jpg"} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'JD'}
                </AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>

              {/* Register Button */}
              <Link to="/register">
                <Button className="bg-gradient-hero hover:opacity-90 transition-smooth">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, TrendingUp, Users, MapPin, LogIn, UserPlus, Award, Briefcase, User } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { getStoredUser } from "@/lib/auth";

interface User {
  userId: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    
    const onStorage = () => {
      const updatedUser = getStoredUser();
      setUser(updatedUser);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const slidingAds = [
    "🎉 30+ people hired today!",
    "💼 500+ new jobs this week",
    "🚀 Top companies are hiring",
    "📈 Career growth opportunities",
    "🌟 Find your dream job today"
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Sliding Announcements */}
          <div className="mb-8 overflow-hidden">
            <div className="flex animate-slide-left">
              {slidingAds.map((ad, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="mx-4 whitespace-nowrap bg-accent/20 text-accent-foreground border-accent/30"
                >
                  {ad}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Bridge Your Way to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Career Success
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with top employers, discover amazing opportunities, and take the next step in your professional journey.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 focus:border-primary shadow-card"
              />
            </div>
            <Button size="lg" className="bg-gradient-hero hover:opacity-90 h-12 px-8">
              <Search className="h-5 w-5 mr-2" />
              Search Jobs
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-5 w-5 mr-2" />
              What did you learn today?
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-secondary text-secondary-foreground hover:bg-secondary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add new post
            </Button>
          </div>

          {/* Auth Navigation Buttons or Role-Based Actions */}
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-hero hover:opacity-90"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/profile">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  <User className="h-5 w-5 mr-2" />
                  My Profile
                </Button>
              </Link>
              {user.role === 'student' && (
                <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90">
                  <Award className="h-5 w-5 mr-2" />
                  Post New Achievement
                </Button>
              )}
              {user.role === 'recruiter' && (
                <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Post New Job
                </Button>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">1,000+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-foreground">50,000+</div>
              <div className="text-muted-foreground">Professionals</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-8 w-8 text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground">200+</div>
              <div className="text-muted-foreground">Companies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
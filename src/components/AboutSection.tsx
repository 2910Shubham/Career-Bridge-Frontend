import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, Award } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Users,
      title: "Connect with Top Talent",
      description: "Join a community of skilled professionals and industry leaders from around the world."
    },
    {
      icon: Briefcase,
      title: "Quality Job Listings",
      description: "Access carefully curated job opportunities from verified companies and startups."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Get insights, tips, and resources to accelerate your professional development."
    },
    {
      icon: Award,
      title: "Success Stories",
      description: "Join thousands of professionals who found their dream jobs through CareerBridge."
    }
  ];

  return (
    <section id="about" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            About CareerBridge
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            CareerBridge is more than just a job board – we're your partner in career success. 
            Our platform connects talented professionals with innovative companies, creating 
            meaningful career opportunities that drive both personal and business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-card transition-all duration-300 border-border">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-gradient-hero hover:opacity-90">
              Join CareerBridge Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
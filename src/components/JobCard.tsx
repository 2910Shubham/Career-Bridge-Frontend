import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, DollarSign, Heart } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    salary: string;
    type: string;
    postedTime: string;
    description: string;
    skills: string[];
    poster: {
      name: string;
      avatar?: string;
      role: string;
    };
  };
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 border-border bg-card">
      <CardContent className="p-6">
        {/* Header with Poster Info */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={job.poster.avatar} alt={job.poster.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {job.poster.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{job.poster.name}</p>
            <p className="text-sm text-muted-foreground">{job.poster.role}</p>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent-foreground">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12 border-2 border-muted">
              <AvatarImage src={job.companyLogo} alt={job.company} />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {job.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-primary font-medium">{job.company}</p>
            </div>
          </div>

          {/* Job Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{job.postedTime}</span>
            </div>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              {job.type}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed">
            {job.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-muted/30 border-t">
        <div className="flex w-full space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Learn More
          </Button>
          <Button className="flex-1 bg-gradient-hero hover:opacity-90">
            Apply Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
import JobCard from "./JobCard";

const JobFeed = () => {
  // Sample job data
  const jobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechFlow Solutions",
      location: "San Francisco, CA",
      salary: "$120K - $150K",
      type: "Full-time",
      postedTime: "2 hours ago",
      description: "We're looking for a passionate frontend developer to join our dynamic team. You'll work on cutting-edge projects using React, TypeScript, and modern web technologies.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
      poster: {
        name: "Sarah Johnson",
        role: "Senior Recruiter at TechFlow",
        avatar: ""
      }
    },
    {
      id: "2",
      title: "Product Manager",
      company: "InnovateX Corp",
      location: "New York, NY",
      salary: "$140K - $170K",
      type: "Full-time",
      postedTime: "5 hours ago",
      description: "Lead product strategy and development for our flagship SaaS platform. Work closely with engineering, design, and business teams to deliver exceptional user experiences.",
      skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
      poster: {
        name: "Michael Chen",
        role: "Head of Talent at InnovateX",
        avatar: ""
      }
    },
    {
      id: "3",
      title: "UX/UI Designer",
      company: "DesignStudio Plus",
      location: "Remote",
      salary: "$90K - $120K",
      type: "Full-time",
      postedTime: "1 day ago",
      description: "Create beautiful and intuitive user experiences for web and mobile applications. Collaborate with product teams to bring innovative design solutions to life.",
      skills: ["Figma", "Sketch", "User Research", "Prototyping"],
      poster: {
        name: "Emily Rodriguez",
        role: "Creative Director",
        avatar: ""
      }
    },
    {
      id: "4",
      title: "Data Scientist",
      company: "DataDriven Analytics",
      location: "Austin, TX",
      salary: "$130K - $160K",
      type: "Full-time",
      postedTime: "2 days ago",
      description: "Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets to extract actionable insights and drive business decisions.",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      poster: {
        name: "David Park",
        role: "Data Science Manager",
        avatar: ""
      }
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudScale Systems",
      location: "Seattle, WA",
      salary: "$110K - $140K",
      type: "Contract",
      postedTime: "3 days ago",
      description: "Build and maintain scalable cloud infrastructure. Implement CI/CD pipelines and ensure high availability of our distributed systems.",
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins"],
      poster: {
        name: "Lisa Thompson",
        role: "Infrastructure Lead",
        avatar: ""
      }
    },
    {
      id: "6",
      title: "Marketing Specialist",
      company: "GrowthHacker Inc",
      location: "Los Angeles, CA",
      salary: "$70K - $90K",
      type: "Part-time",
      postedTime: "4 days ago",
      description: "Drive digital marketing campaigns and growth initiatives. Analyze performance metrics and optimize marketing strategies across multiple channels.",
      skills: ["Digital Marketing", "SEO", "Google Analytics", "Content Creation"],
      poster: {
        name: "Alex Kumar",
        role: "Marketing Director",
        avatar: ""
      }
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Latest Job Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing career opportunities from top companies worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-hero text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-smooth shadow-elegant">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobFeed;
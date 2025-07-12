import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const mockProfile = {
  name: "John Recruiter",
  profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "Recruiter at TechCorp, passionate about building great teams.",
  skills: ["Talent Acquisition", "HR", "Tech Hiring"],
  achievements: ["Hired 100+ engineers in 2024", "Best Recruiter Award 2023"],
  posts: [
    {
      id: 1,
      description: "We are hiring for multiple roles in our AI division!",
    },
    {
      id: 2,
      description: "Excited to announce our new internship program.",
    },
  ],
  jobPosts: [
    {
      id: 1,
      title: "Frontend Developer",
      applications: 42,
      status: "Open",
    },
    {
      id: 2,
      title: "Data Scientist",
      applications: 30,
      status: "Closed",
    },
  ],
};

export default function RecruiterProfile() {
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [achievements, setAchievements] = useState(mockProfile.achievements);
  const [newAchievement, setNewAchievement] = useState("");
  const [jobPosts, setJobPosts] = useState(mockProfile.jobPosts);
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: "" });

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement("");
      setShowAddDetails(false);
    }
  };

  const handleCreateJob = () => {
    if (newJob.title.trim()) {
      setJobPosts([
        ...jobPosts,
        { id: jobPosts.length + 1, title: newJob.title, applications: 0, status: "Open" },
      ]);
      setNewJob({ title: "" });
      setShowJobForm(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card className="p-6 flex flex-col items-center gap-4 shadow-elegant">
        <img
          src={mockProfile.profilePic}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-card"
        />
        <h2 className="text-2xl font-bold text-foreground">{mockProfile.name}</h2>
        <p className="text-muted-foreground text-center">{mockProfile.bio}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {mockProfile.skills.map((skill) => (
            <span key={skill} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
        <div className="w-full mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground">Achievements</h3>
            <Button size="sm" variant="secondary" onClick={() => setShowAddDetails(true)}>
              Add Details
            </Button>
          </div>
          <ul className="list-disc pl-5 text-muted-foreground">
            {achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
          {showAddDetails && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add achievement..."
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
              />
              <Button onClick={handleAddAchievement}>Add</Button>
              <Button variant="ghost" onClick={() => setShowAddDetails(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-foreground">Job Posts</h3>
          <Button size="sm" onClick={() => setShowJobForm(true)}>
            Create Job Application
          </Button>
        </div>
        {showJobForm && (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Job title..."
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <Button onClick={handleCreateJob}>Add</Button>
            <Button variant="ghost" onClick={() => setShowJobForm(false)}>
              Cancel
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {jobPosts.map((job) => (
            <Card key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{job.title}</h4>
                <p className="text-muted-foreground text-sm">Applications: {job.applications}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${job.status === "Open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {job.status}
                </span>
              </div>
              <Button variant="outline" className="mt-2 sm:mt-0">See Performance</Button>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-3 text-foreground">Posts</h3>
        <div className="flex flex-col gap-4">
          {mockProfile.posts.map((post) => (
            <Card key={post.id} className="p-4">
              <p className="text-foreground">{post.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 
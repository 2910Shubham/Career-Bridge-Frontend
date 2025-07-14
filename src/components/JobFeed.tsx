import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";

const toJobCardFormat = (job) => ({
  id: job._id,
  title: job.jobTitle,
  company: job.companyName,
  companyLogo: '',
  location: job.jobLocation,
  salary: job.salaryRange,
  type: job.jobType,
  postedTime: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently',
  description: job.jobDescription,
  skills: job.skillsRequired || [],
  poster: {
    name: job.recruiterId?.fullname || 'Recruiter',
    avatar: job.recruiterId?.profilePicture || '',
    role: job.recruiterId?.email || '',
    id: job.recruiterId?._id || '',
    username: job.recruiterId?.username || '',
  },
});

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/job")
      .then((res) => res.json())
      .then((data) => {
        console.log('DEBUG /api/job:', data);
        setJobs(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, []);

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

        {loading ? (
          <div className="text-center text-lg text-muted-foreground">Loading jobs...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job._id} job={toJobCardFormat(job)} />
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground">No jobs found.</div>
            )}
          </div>
        )}

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
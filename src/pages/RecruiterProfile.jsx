import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Calendar, Award, Briefcase, Heart, MessageCircle, Share2, Edit3, Image, X, Users, TrendingUp, Eye, FileText, Building, DollarSign, Clock, Settings, PenBox } from "lucide-react";
import Navbar from "@/components/Navbar";
import JobPostForm from "@/components/JobPostForm";
import EditProfileForm from "@/components/EditProfileForm";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
import JobCard from "@/components/JobCard";


export default function RecruiterProfile({ isPublicView = false }) {
  const { user, refreshUser } = useAuth();
  const { id: recruiterIdParam } = useParams();
  const [publicRecruiter, setPublicRecruiter] = useState(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [newPost, setNewPost] = useState({ description: "", images: [] });
  const [previewImages, setPreviewImages] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    skills: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState("");
  const [jobSuccess, setJobSuccess] = useState("");
  const [editJob, setEditJob] = useState(null);
  const [showEditJobForm, setShowEditJobForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user && user.jobPosts) {
      setJobPosts(user.jobPosts);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isPublicView && recruiterIdParam) {
      setPublicLoading(true);
      fetch(`/api/users/${recruiterIdParam}`)
        .then(res => res.json())
        .then(data => {
          setPublicRecruiter(data.data || data.user || null);
          setPublicLoading(false);
        })
        .catch(() => setPublicLoading(false));
    }
  }, [isPublicView, recruiterIdParam]);

  useEffect(() => {
    // Debug: Log /api/auth/me response
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log('DEBUG /api/auth/me:', data);
      })
      .catch(err => console.error('DEBUG /api/auth/me error:', err));
  }, []);

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement("");
      setShowAddDialog(false);
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreviewImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    if (newPost.description.trim() || previewImages.length > 0) {
      const post = {
        id: Date.now(),
        description: newPost.description.trim(),
        timestamp: "just now",
        likes: 0,
        comments: 0,
        images: previewImages
      };
      setPosts([post, ...posts]);
      setNewPost({ description: "", images: [] });
      setPreviewImages([]);
      setShowNewPostDialog(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    setJobLoading(true);
    setJobError("");
    setJobSuccess("");
    try {
      const response = await fetch('/api/job/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          jobTitle: jobData.jobTitle,
          jobDescription: jobData.jobDescription,
          jobLocation: jobData.jobLocation,
          jobType: jobData.jobType,
          salaryRange: jobData.salaryRange,
          companyName: jobData.companyName,
          companyDescription: jobData.companyDescription,
          companyWebsite: jobData.companyWebsite,
          skillsRequired: jobData.skillsRequired,
          applicationDeadline: jobData.applicationDeadline,
          jobStatus: jobData.jobStatus,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create job post');
      }
      setJobSuccess('Job post created successfully!');
      await refreshUser();
    } catch (err) {
      setJobError(err.message || 'Error creating job post');
    } finally {
      setJobLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.type === "blur") && newSkill.trim()) {
      if (!newJob.skills.includes(newSkill.trim())) {
        setNewJob({ ...newJob, skills: [...newJob.skills, newSkill.trim()] });
      }
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setNewJob({ ...newJob, skills: newJob.skills.filter((s) => s !== skill) });
  };

  const handleSaveProfile = (updatedUser) => {
    setLoading(true);
    // storeUserData(updatedUser); // This line is removed as per the edit hint
    setShowEditProfile(false);
    setLoading(false);
  };

  // Helper to transform backend job post to JobCard format
  const toJobCardFormat = (job) => ({
    id: job._id,
    title: job.jobTitle,
    company: job.companyName,
    companyLogo: '', // No logo in backend data
    location: job.jobLocation,
    salary: job.salaryRange,
    type: job.jobType,
    postedTime: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently',
    description: job.jobDescription,
    skills: job.skillsRequired || [],
    poster: {
      name: 'You', // Or fetch recruiter name if available
      avatar: '',
      role: 'Recruiter',
    },
  });

  // Handler to delete a job post
  const handleDeleteJob = useCallback(async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete job post');
      await refreshUser();
    } catch (err) {
      alert('Error deleting job post: ' + err.message);
    }
  }, [refreshUser]);

  // Handler to edit a job post (stub, implement modal or navigation as needed)
  const handleEditJob = (job) => {
    setEditJob(job);
    setShowEditJobForm(true);
  };

  const handleUpdateJob = async (jobData) => {
    if (!editJob) return;
    setJobLoading(true);
    setJobError("");
    setJobSuccess("");
    try {
      const response = await fetch(`/api/job/${editJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update job post');
      }
      setJobSuccess('Job post updated successfully!');
      setShowEditJobForm(false);
      setEditJob(null);
      await refreshUser();
    } catch (err) {
      setJobError(err.message || 'Error updating job post');
    } finally {
      setJobLoading(false);
    }
  };

  // Use publicRecruiter if in public view, else use logged-in user
  const profileUser = isPublicView && publicRecruiter ? publicRecruiter : user;

  // Show loading spinner while checking authentication or fetching public profile
  if (loading || (isPublicView && publicLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
 
  // Redirect to login if no user is found
  
  if (!profileUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate profile if user role doesn't match
  if (profileUser.role !== 'recruiter') {
    if (profileUser.role === 'student') {
      return <Navigate to="/student-profile" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  const mockApplications = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <Navbar />
      <style>{`
        .gradient-hero {
          background: linear-gradient(135deg, hsl(175 17% 43%), hsl(145 23% 60%));
        }
        .gradient-accent {
          background: linear-gradient(90deg, hsl(95 32% 75%), hsl(145 23% 60%));
        }
        .shadow-elegant {
          box-shadow: 0 10px 30px -10px hsl(175 17% 43% / 0.2);
        }
        .shadow-card {
          box-shadow: 0 4px 12px -2px hsl(0 0% 0% / 0.1);
        }
        .transition-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Hero Section */}
        <div className="gradient-hero rounded-3xl p-8 text-white shadow-elegant mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white/20 shadow-card">
                <AvatarImage src={profileUser?.profilePicture || '/default-avatar.png'} alt={profileUser?.fullname || 'User'} />
                <div className="h-4 w-4">{profileUser?.profilePicture}</div>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <h1 className="text-4xl font-bold text-center w-full">{profileUser?.fullname || 'User'}</h1>
              {/* Edit Profile button absolutely positioned at bottom right of header */}
              <Button 
                onClick={() => setShowEditProfile(true)}
                size="sm"
                className="transition-smooth hover:scale-105 absolute right-0 bottom-0 md:bottom-4 md:right-4"
                style={{zIndex: 20}}
              >
                <PenBox className="w-2 h-4 mr-2" />
                
              </Button>
              <div className="flex flex-wrap gap-4 justify-center md:justify-center text-sm mb-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">@{profileUser?.username || 'username'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{profileUser?.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{profileUser?.phoneNumber || 'No phone'}</span>
                </div>
              </div>
              <p className="text-xl text-white/90 mb-4 text-center">{profileUser?.bio || 'No bio available'}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-center text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profileUser?.location || 'No location'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{profileUser?.recruiterInfo.companyName || 'No company'} • {profileUser?.recruiterInfo.designation || 'No designation'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{profileUser?.dateOfBirth ? new Date(profileUser.dateOfBirth).toLocaleDateString() : 'No DOB'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row - now horizontal */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <Card className="flex-1 shadow-card transition-smooth hover:shadow-elegant">
            <CardContent className="p-6 text-center">
              <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{profileUser?.recruiterInfo?.jobPosts?.length ?? 0}</div>
              <div className="text-sm text-slate-600">Job Posts</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-card transition-smooth hover:shadow-elegant">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{profileUser?.recruiterInfo?.hiringStats?.totalApplications ?? 0}</div>
              <div className="text-sm text-slate-600">Applications</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-card transition-smooth hover:shadow-elegant">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{profileUser?.recruiterInfo?.hiringStats?.successfulHires ?? 0}</div>
              <div className="text-sm text-slate-600">Successful Hires</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-card transition-smooth hover:shadow-elegant">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{profileUser?.recruiterInfo?.hiringStats?.averageTimeToHire ?? '--'}</div>
              <div className="text-sm text-slate-600">Avg. Time to Hire</div>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Achievements - full width, stacked */}
        <div className="w-full flex flex-col gap-6 mb-8">
          {/* Skills Section */}
          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-lg">Skills</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-wrap gap-2">
              {profileUser?.skills?.length > 0 ? (
                profileUser.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gradient-accent text-slate-700 border-0 transition-smooth hover:scale-105">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-400">No skills added yet.</span>
              )}
            </CardContent>
          </Card>
          {/* Achievements Section */}
          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-lg">Achievements</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {profileUser?.achievements?.length > 0 ? (
                profileUser.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-1">
                    <span className="text-sm text-slate-700">{achievement.title || achievement}</span>
                    {achievement.description && <span className="ml-2 text-xs text-slate-500">{achievement.description}</span>}
                  </div>
                ))
              ) : (
                <span className="text-slate-400">No achievements yet.</span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - only posts/job posts/applications */}
        <div className="w-full">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6" />
            
            <TabsContent value="posts" className="space-y-6 mt-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Recent Posts</h2>
                <div className="flex flex-row gap-2">
                  {/* New Post Button */}
                  <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                    <DialogTrigger asChild>
                      <Button className="gradient-hero border-0 transition-smooth hover:scale-105">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={profileUser?.profilePicture || '/default-avatar.png'} alt={profileUser?.fullname || 'User'} />
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Share job opportunities, recruiting tips, or industry insights..."
                              value={newPost.description}
                              onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                              className="min-h-[100px] resize-none border-none focus:ring-0 text-lg"
                            />
                          </div>
                        </div>
                        
                        {previewImages.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                            {previewImages.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removePreviewImage(index)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                            >
                              <Image className="w-5 h-5 text-slate-600" />
                              <span className="text-sm text-slate-600">Add Photos</span>
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreatePost} disabled={!newPost.description.trim() && previewImages.length === 0}>
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* Post New Job Button */}
                  <Button 
                    variant="outline" 
                    className="transition-smooth hover:scale-105"
                    onClick={() => setShowJobForm(true)}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                  {/* Recent Applicants Button */}
                  <Button variant="outline" className="transition-smooth hover:scale-105">
                    <Users className="w-4 h-4 mr-2" />
                    Recent Applicants
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
                <Tabs defaultValue="social" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="social">Social Posts</TabsTrigger>
                    <TabsTrigger value="jobs">Job Posts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="social">
                    {posts && posts.length > 0 ? (
                      posts.map(post => (
                        // Replace with your existing social post card component
                        <Card key={post.id || post._id} className="mb-4">
                          <CardContent>
                            <div className="font-semibold">{post.description || post.content}</div>
                            {/* Add more post details as needed */}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-gray-400">No social posts yet.</div>
                    )}
                  </TabsContent>
                  <TabsContent value="jobs">
                    {jobPosts && jobPosts.length > 0 ? (
                      jobPosts.map(job => (
                        <JobCard
                          key={job._id}
                          job={toJobCardFormat(job)}
                          isRecruiterView={true}
                          onEdit={() => handleEditJob(job)}
                          onDelete={() => handleDeleteJob(job._id)}
                        />
                      ))
                    ) : (
                      <div className="text-gray-400">No job posts yet.</div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Job Posts</h2>
                {/* The JobPostForm component is now integrated into the Posts tab header */}
              </div>

              {jobPosts.length > 0 && (
                <div className="space-y-6 mt-8">
                  <h2 className="text-2xl font-bold mb-4">Your Job Posts</h2>
                  {jobPosts.map(job => (
                    <JobCard key={job._id} job={toJobCardFormat(job)} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Application Performance</h2>
                <Button variant="outline" className="transition-smooth hover:scale-105">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <h3 className="font-semibold text-lg">Recent Applications</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockApplications.map((app, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={app.avatar} alt={app.name} />
                              <AvatarFallback className="text-xs">{app.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-800">{app.name}</div>
                              <div className="text-xs text-slate-500">{app.position}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant={app.status === "Offer Sent" ? "default" : app.status === "Rejected" ? "secondary" : "outline"}>
                              {app.status}
                            </Badge>
                            <span className="text-xs text-slate-400 mt-1">{app.applied}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader>
                    <h3 className="font-semibold text-lg">Quick Stats</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-700">Total Applications:</span>
                        <span className="font-bold">{profileUser?.recruiterInfo?.hiringStats?.totalApplications ?? 0}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-green-500" />
                        <span className="text-slate-700">Job Posts:</span>
                        <span className="font-bold">{profileUser?.recruiterInfo?.jobPosts?.length ?? 0}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span className="text-slate-700">Successful Hires:</span>
                        <span className="font-bold">{profileUser?.recruiterInfo?.hiringStats?.successfulHires ?? 0}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-slate-700">Avg. Time to Hire:</span>
                        <span className="font-bold">{profileUser?.recruiterInfo?.hiringStats?.averageTimeToHire ?? '--'}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Job Post Form */}
      <JobPostForm 
        isOpen={showJobForm}
        onOpenChange={setShowJobForm}
        onSubmit={handleCreateJob}
      />
      {jobLoading && <div className="text-center text-blue-600 mt-2">Posting job...</div>}
      {jobError && <div className="text-center text-red-600 mt-2">{jobError}</div>}
      {jobSuccess && <div className="text-center text-green-600 mt-2">{jobSuccess}</div>}

      {/* Edit Profile Form */}
      <EditProfileForm 
        isOpen={showEditProfile}
        onOpenChange={setShowEditProfile}
        onSave={handleSaveProfile}
      />
      <JobPostForm
        isOpen={showEditJobForm}
        onOpenChange={setShowEditJobForm}
        onSubmit={handleUpdateJob}
        initialValues={editJob}
        mode="edit"
      />
    </div>
  );
}
import React, { useState, useEffect } from "react";
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
import { Plus, MapPin, Calendar, Award, Briefcase, Heart, MessageCircle, Share2, Edit3, Image, X, Users, TrendingUp, Eye, FileText, Building, DollarSign, Clock, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import JobPostForm from "@/components/JobPostForm";
import EditProfileForm from "@/components/EditProfileForm";
import { getStoredUser, verifyUserAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';

const mockProfile = {
  name: "Sarah Johnson",
  profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
  bio: "Senior Tech Recruiter at InnovateTech | Connecting top talent with innovative companies | 8+ years in tech recruitment 🚀",
  location: "New York, NY",
  company: "InnovateTech Solutions",
  title: "Senior Technical Recruiter",
  skills: ["Technical Recruiting", "Talent Acquisition", "Interviewing", "Candidate Assessment", "HR Technology", "Networking"],
  achievements: [
    "🏆 Top Recruiter of the Year 2023",
    "💼 Placed 150+ candidates in 2023",
    "🌟 95% candidate satisfaction rate",
    "📈 Reduced time-to-hire by 40%"
  ],
  posts: [
    {
      id: 1,
      description: "Excited to announce we're hiring 5 Senior Software Engineers! Looking for passionate developers with React and Node.js experience. Remote-friendly culture! 💻",
      timestamp: "2 hours ago",
      likes: 28,
      comments: 12,
      images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"]
    },
    {
      id: 2,
      description: "Just had an amazing conversation with a candidate who's transitioning from finance to tech. Love helping people find their passion! 🌟",
      timestamp: "1 day ago",
      likes: 45,
      comments: 8,
      images: []
    }
  ],
  jobPosts: [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "InnovateTech Solutions",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      applicants: 47,
      posted: "2 days ago",
      status: "Active"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateTech Solutions",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130k - $170k",
      applicants: 23,
      posted: "1 week ago",
      status: "Active"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "InnovateTech Solutions",
      location: "Hybrid",
      type: "Full-time",
      salary: "$90k - $120k",
      applicants: 31,
      posted: "3 days ago",
      status: "Closed"
    }
  ],
  stats: {
    totalJobPosts: 12,
    totalApplications: 287,
    successfulHires: 23,
    averageTimeToHire: "18 days"
  }
};

// Add this mock applications data for the Applications tab
const mockApplications = [
  {
    name: "John Smith",
    position: "Senior Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    status: "Interviewing",
    applied: "2 days ago"
  },
  {
    name: "Maria Garcia",
    position: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    status: "Offer Sent",
    applied: "1 week ago"
  },
  {
    name: "Alex Chen",
    position: "UX Designer",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg",
    status: "Screening",
    applied: "3 days ago"
  },
  {
    name: "Sarah Wilson",
    position: "Data Scientist",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    status: "Rejected",
    applied: "5 days ago"
  }
];

export default function RecruiterProfile() {
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
  const [user, setUser] = useState(null);
  const [fullProfile, setFullProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      let authUser = await verifyUserAuth();
      if (!authUser) authUser = getStoredUser();
      setUser(authUser);

      if (authUser && authUser.userId) {
        const res = await fetch(`/api/users/${authUser.userId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFullProfile(data);
          setAchievements(data.achievements || []);
          setPosts(data.posts || []);
          setJobPosts(data.recruiterInfo?.jobPosts || []);
        }
      }
      setLoading(false);
    };
    fetchProfile();
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

  const handleCreateJob = (jobData) => {
    const job = {
      id: Date.now(),
      title: jobData.jobTitle,
      company: jobData.companyName,
      location: jobData.jobLocation,
      type: jobData.jobType,
      salary: jobData.salaryRange,
      description: jobData.jobDescription,
      skills: jobData.skillsRequired,
      deadline: jobData.applicationDeadline,
      status: jobData.jobStatus,
      applicants: 0,
      posted: "just now",
    };
    setJobPosts([job, ...jobPosts]);
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
    // Here you would typically make an API call to update the user profile
    console.log('Profile updated:', updatedUser);
    // For now, we'll just close the dialog
    setShowEditProfile(false);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if no user is found
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate profile if user role doesn't match
  if (user.role !== 'recruiter') {
    if (user.role === 'student') {
      return <Navigate to="/student-profile" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <Navbar />
      <style jsx global>{`
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
              <Avatar className="w-32 h-32 border-4 border-white/20 shadow-card">
                <AvatarImage src={fullProfile?.profilePicture || '/default-avatar.png'} alt={fullProfile?.fullname || 'User'} />
                <AvatarFallback className="text-2xl bg-white/20">{fullProfile?.fullname ? fullProfile.fullname.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold">{fullProfile?.fullname || 'User'}</h1>
                <Button 
                  onClick={() => setShowEditProfile(true)}
                  size="sm"
                  className="transition-smooth hover:scale-105"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <p className="text-xl text-white/90 mb-4">{fullProfile?.bio}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{fullProfile?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{fullProfile?.recruiterInfo?.companyName} • {fullProfile?.recruiterInfo?.designation}</span>
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
              <div className="text-2xl font-bold text-slate-800">{mockProfile.stats.totalJobPosts}</div>
              <div className="text-sm text-slate-600">Job Posts</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-card transition-smooth hover:shadow-elegant">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{mockProfile.stats.totalApplications}</div>
              <div className="text-sm text-slate-600">Applications</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-card transition-smooth hover:shadow-elegant">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{mockProfile.stats.successfulHires}</div>
              <div className="text-sm text-slate-600">Successful Hires</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-card transition-smooth hover:shadow-elegant">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{mockProfile.stats.averageTimeToHire}</div>
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
              {mockProfile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gradient-accent text-slate-700 border-0 transition-smooth hover:scale-105">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>
          {/* Achievements Section */}
          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-lg">Achievements</h3>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline" className="flex items-center justify-center h-8 w-8 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Achievement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Enter your achievement..."
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddAchievement}>Add Achievement</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-3 p-1">
                  <span className="text-sm text-slate-700">{achievement}</span>
                </div>
              ))}
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
                            <AvatarImage src={fullProfile?.profilePicture || '/default-avatar.png'} alt={fullProfile?.fullname || 'User'} />
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

              <div className="flex flex-col gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="shadow-card transition-smooth hover:shadow-elegant">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={fullProfile?.profilePicture || '/default-avatar.png'} alt={fullProfile?.fullname || 'User'} />
                          <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-800">{fullProfile?.fullname || 'User'}</h4>
                            <span className="text-slate-500 text-sm">• {post.timestamp}</span>
                          </div>
                          <p className="text-slate-700 mb-4 leading-relaxed">{post.description}</p>
                          
                          {post.images && post.images.length > 0 && (
                            <div className={`mb-4 ${post.images.length === 1 ? 'max-w-md' : 'grid grid-cols-2 gap-2'}`}>
                              {post.images.map((img, index) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt={`Post image ${index + 1}`}
                                  className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(img, '_blank')}
                                />
                              ))}
                            </div>
                          )}
                          
                          <Separator className="my-4" />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <button
                                onClick={() => handleLike(post.id)}
                                className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-smooth"
                              >
                                <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                <span className="text-sm">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                              </button>
                              <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-smooth">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">{post.comments}</span>
                              </button>
                            </div>
                            <button className="flex items-center gap-2 text-slate-600 hover:text-green-500 transition-smooth">
                              <Share2 className="w-5 h-5" />
                              <span className="text-sm">Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Job Posts</h2>
                {/* The JobPostForm component is now integrated into the Posts tab header */}
              </div>

              <div className="space-y-4">
                {jobPosts.map((job) => (
                  <Card key={job.id} className="shadow-card transition-smooth hover:shadow-elegant">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-800">{job.title}</h3>
                            <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-3">{job.company}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-blue-600">
                              <Users className="w-4 h-4" />
                              {job.applicants} applicants
                            </span>
                            <span className="text-slate-500">Posted {job.posted}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                        <span className="font-bold">{mockProfile.stats.totalApplications}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-green-500" />
                        <span className="text-slate-700">Job Posts:</span>
                        <span className="font-bold">{mockProfile.stats.totalJobPosts}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span className="text-slate-700">Successful Hires:</span>
                        <span className="font-bold">{mockProfile.stats.successfulHires}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-slate-700">Avg. Time to Hire:</span>
                        <span className="font-bold">{mockProfile.stats.averageTimeToHire}</span>
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

      {/* Edit Profile Form */}
      <EditProfileForm 
        isOpen={showEditProfile}
        onOpenChange={setShowEditProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
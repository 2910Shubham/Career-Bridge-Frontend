import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, Calendar, Award, Code, Heart, MessageCircle, Share2, Edit3, Image, X, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import EditProfileForm from "@/components/EditProfileForm";
import { getStoredUser } from '@/lib/auth';

const mockProfile = {
  name: "Jane Doe",
  profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
  bio: "Aspiring software engineer passionate about AI and web development. Always learning, always growing. 🚀",
  location: "San Francisco, CA",
  university: "Stanford University",
  year: "Junior",
  skills: ["JavaScript", "React", "Python", "Machine Learning", "Node.js", "TypeScript"],
  achievements: [
    "🏆 Winner, Hackathon 2024",
    "🎓 Dean's List 2023",
    "💡 Published Research Paper on AI Ethics",
    "🌟 Google Summer of Code Participant"
  ],
  posts: [
    {
      id: 1,
      description: "Just completed a project on sentiment analysis using Python! The model achieved 94% accuracy on the test dataset. Excited to dive deeper into NLP! 🤖",
      timestamp: "2 hours ago",
      likes: 42,
      comments: 8,
      images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"]
    },
    {
      id: 2,
      description: "Excited to start my internship at TechCorp! Ready to apply everything I've learned and contribute to real-world projects. Here we go! 🚀",
      timestamp: "1 day ago",
      likes: 87,
      comments: 15,
      images: []
    },
    {
      id: 3,
      description: "Attended an amazing workshop on React Server Components today. The future of web development looks incredible! 💻",
      timestamp: "3 days ago",
      likes: 23,
      comments: 5,
      images: ["https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"]
    }
  ],
};

export default function StudentProfile() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ description: "", images: [] });
  const [previewImages, setPreviewImages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    if (storedUser) {
      setAchievements(storedUser.achievements || []);
      setPosts(storedUser.posts || []);
    }
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

  const handleSaveProfile = (updatedUser) => {
    // Here you would typically make an API call to update the user profile
    console.log('Profile updated:', updatedUser);
    // For now, we'll just close the dialog
    setShowEditProfile(false);
  };

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
                <AvatarImage src={user?.profilePicture || '/default-avatar.png'} alt={user?.fullname || 'User'} />
                <AvatarFallback className="text-2xl bg-white/20">{user?.fullname ? user.fullname.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
                              <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold">{user?.fullname || 'User'}</h1>
                  <Button 
                    onClick={() => setShowEditProfile(true)}
                    size="sm"
                    className="transition-smooth hover:scale-105"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              <p className="text-xl text-white/90 mb-4">{user?.bio}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{user?.studentInfo?.university} • {user?.studentInfo?.currentYear}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills Section */}
            <Card className="shadow-card transition-smooth hover:shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-lg">Skills</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gradient-accent text-slate-700 border-0 transition-smooth hover:scale-105">
                      {skill}
                    </Badge>
                  ))}
                </div>
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
                      <Button size="sm" variant="outline" className="transition-smooth hover:scale-105">
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
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 transition-smooth hover:bg-slate-100">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-slate-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Recent Posts</h2>
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
                        <AvatarImage src={user?.profilePicture || '/default-avatar.png'} alt={user?.fullname || 'User'} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="What's on your mind?"
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
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="shadow-card transition-smooth hover:shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.profilePicture || '/default-avatar.png'} alt={user?.fullname || 'User'} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-800">{user?.fullname || 'User'}</h4>
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
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <EditProfileForm 
        isOpen={showEditProfile}
        onOpenChange={setShowEditProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
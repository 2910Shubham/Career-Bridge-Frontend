import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, Calendar, Award, Code, Heart, MessageCircle, Share2, Edit3, Image, X, Settings, GraduationCap, Briefcase, Globe, Users, Eye, PenBox } from "lucide-react";
import Navbar from "@/components/Navbar";
import EditProfileForm from "@/components/EditProfileForm";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentProfile() {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ description: "", images: [] });
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user) {
      // If we have posts data, set it
      if (user.posts && Array.isArray(user.posts)) {
        setPosts(user.posts);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

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
    setPosts(prev => prev.map(post => 
      post.id === postId || post._id === postId
        ? { ...post, likes: (post.likes || 0) + (likedPosts.has(postId) ? -1 : 1) }
        : post
    ));
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
    // Update user in context
    // login(updatedUser, null); // null token means don't update token
    setShowEditProfile(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getProfileImage = () => {
    if (user?.profilePicture && !user.profilePicture.includes('deafult.png')) {
      return user.profilePicture;
    }
    return '/default-avatar.png';
  };

  const getUserInitials = () => {
    if (user?.fullname) {
      return user.fullname.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'student') {
    if (user.role === 'recruiter') {
      return <Navigate to="/recruiter-profile" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

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
              <Avatar className="w-32 h-32 border-4 border-white/20 shadow-card">
                <AvatarImage src={getProfileImage()} alt={user?.fullname || 'User'} />
                <AvatarFallback className="text-2xl bg-white/20">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <h1 className="text-4xl font-bold text-center w-full">{user?.fullname || 'User'}</h1>
              {/* Edit Profile button absolutely positioned at bottom right of header */}
              <Button 
                onClick={() => setShowEditProfile(true)}
                size="sm"
                className="transition-smooth hover:scale-105 absolute right-0 bottom-0 md:bottom-4 md:right-4"
                style={{zIndex: 20}}
              >
                <PenBox className="w-4 h-4 mr-2" />
              </Button>
              <div className="flex flex-wrap gap-4 justify-center md:justify-center text-sm mb-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">@{user?.username || 'username'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{user?.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{user?.phoneNumber || 'No phone'}</span>
                </div>
              </div>
              <p className="text-xl text-white/90 mb-4 text-center">{user?.bio || 'No bio available'}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-center text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location || 'No location'}</span>
                </div>
                {user?.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Born: {formatDate(user.dateOfBirth)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{user?.profileViews?.length ?? 0} profile views</span>
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
                  {user?.skills?.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="gradient-accent text-slate-700 border-0 transition-smooth hover:scale-105">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-400">No skills added yet.</span>
                  )}
                </div>
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
              <CardContent>
                <div className="space-y-3">
                  {user?.achievements?.length > 0 ? (
                    user.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 transition-smooth hover:bg-slate-100">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{achievement.title}</div>
                          {achievement.description && achievement.description !== 'no deacription' && (
                            <div className="text-sm text-slate-600 mt-1">{achievement.description}</div>
                          )}
                          {achievement.date && (
                            <div className="text-xs text-slate-500 mt-1">{formatDate(achievement.date)}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400">No achievements yet.</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages Section */}
            {user?.studentInfo?.languages?.length > 0 ? (
              <Card className="shadow-card transition-smooth hover:shadow-elegant">
                <CardHeader>
                  <Globe className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-lg">Languages</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.studentInfo.languages.map((language, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                        <span className="font-medium">{language.name || language}</span>
                        {language.proficiency && <Badge variant="outline">{language.proficiency}</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Certifications Section */}
            {user?.studentInfo?.certifications?.length > 0 ? (
              <Card className="shadow-card transition-smooth hover:shadow-elegant">
                <CardHeader>
                  <Award className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-lg">Certifications</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.studentInfo.certifications.map((cert, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium text-slate-800">{cert.name || cert}</div>
                        {cert.issuer && <div className="text-sm text-slate-600">{cert.issuer}</div>}
                        {cert.date && (
                          <div className="text-xs text-slate-500 mt-1">{formatDate(cert.date)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Education Section */}
            {user?.education?.length > 0 ? (
              <Card className="shadow-card transition-smooth hover:shadow-elegant">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-slate-600" />
                    <h3 className="font-semibold text-lg">Education</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{edu.degree || 'No degree'}</div>
                          <div className="text-slate-600">{edu.institution || 'No institution'}</div>
                          <div className="text-sm text-slate-500 mt-1">
                            {edu.startDate ? formatDate(edu.startDate) : 'No start'} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                          </div>
                          {edu.grade && (
                            <div className="text-sm text-slate-600 mt-1">Grade: {edu.grade}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Projects Section */}
            {user?.studentInfo?.projects?.length > 0 && (
              <Card className="shadow-card transition-smooth hover:shadow-elegant">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-slate-600" />
                    <h3 className="font-semibold text-lg">Projects</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.studentInfo.projects.map((project, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="font-semibold text-slate-800">{project.title}</div>
                        <div className="text-sm text-slate-600 mt-2">{project.description}</div>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Internships Section */}
            {user?.studentInfo?.internships?.length > 0 && (
              <Card className="shadow-card transition-smooth hover:shadow-elegant">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-slate-600" />
                    <h3 className="font-semibold text-lg">Internships</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.studentInfo.internships.map((internship, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{internship.position}</div>
                          <div className="text-slate-600">{internship.company}</div>
                          <div className="text-sm text-slate-500 mt-1">
                            {internship.startDate && formatDate(internship.startDate)} - {internship.endDate ? formatDate(internship.endDate) : 'Present'}
                          </div>
                          {internship.description && (
                            <div className="text-sm text-slate-600 mt-2">{internship.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Section */}
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
                        <AvatarImage src={getProfileImage()} alt={user?.fullname || 'User'} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
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
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id || post._id} className="shadow-card transition-smooth hover:shadow-elegant">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={getProfileImage()} alt={user?.fullname || 'User'} />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-800">{user?.fullname || 'User'}</h4>
                            <span className="text-slate-500 text-sm">• {post.timestamp || 'Recently'}</span>
                          </div>
                          <p className="text-slate-700 mb-4 leading-relaxed">{post.description || post.content}</p>
                          
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
                                onClick={() => handleLike(post.id || post._id)}
                                className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-smooth"
                              >
                                <Heart className={`w-5 h-5 ${likedPosts.has(post.id || post._id) ? 'fill-red-500 text-red-500' : ''}`} />
                                <span className="text-sm">{(post.likes || 0) + (likedPosts.has(post.id || post._id) ? 1 : 0)}</span>
                              </button>
                              <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-smooth">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">{post.comments || 0}</span>
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
                ))
              ) : (
                <Card className="shadow-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-slate-400 mb-4">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                      <p>No posts yet</p>
                      <p className="text-sm">Share your thoughts and experiences with the community!</p>
                    </div>
                    <Button 
                      onClick={() => setShowNewPostDialog(true)}
                      className="gradient-hero border-0"
                    >
                      Create Your First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
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
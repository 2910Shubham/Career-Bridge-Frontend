import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code, 
  Globe, 
  Plus, 
  X, 
  Upload, 
  Save, 
  Building,
  Users,
  DollarSign,
  Clock,
  ExternalLink,
  Cookie,
  CloudCog
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';


interface User {
  userId: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  skills?: string[];
  achievements?: Array<{
    title?: string;
    description?: string;
    category?: string;
    icon?: string;
    date?: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: number;
    description?: string;
  }>;
  experience?: Array<{
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description?: string;
    location?: string;
    employmentType?: string;
  }>;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    personalWebsite?: string;
    portfolio?: string;
  };
  studentInfo?: {
    university?: string;
    major?: string;
    minor?: string;
    graduationYear?: number;
    currentYear?: string;
    gpa?: number;
    academicStanding?: string;
  };
  recruiterInfo?: {
    companyName?: string;
    companyDescription?: string;
    companyWebsite?: string;
    companyLogo?: string;
    companySize?: string;
    industry?: string;
    department?: string;
    designation?: string;
  };
}

interface EditProfileFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: User) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ isOpen, onOpenChange, onSave }) => {
  const { user: contextUser, refreshUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', category: 'personal', icon: '🏆' });
  const [newEducation, setNewEducation] = useState({ degree: '', institution: '', startDate: '', endDate: '', current: false, gpa: 0, description: '' });
  const [newExperience, setNewExperience] = useState({ jobTitle: '', company: '', startDate: '', endDate: '', current: false, description: '', location: '', employmentType: 'Full-time' });
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && user === null) {
      setUser(contextUser);
      setProfilePicFile(null); // Reset file state when dialog opens
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    if (!user) return;
    setUser({
      ...user,
      [parent]: {
        ...(user[parent as keyof User] as object || {}),
        [field]: value
      }
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && user) {
      const updatedSkills = [...(user.skills || []), newSkill.trim()];
      setUser({ ...user, skills: updatedSkills });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!user) return;
    const updatedSkills = user.skills?.filter(skill => skill !== skillToRemove) || [];
    setUser({ ...user, skills: updatedSkills });
  };

  const handleAddAchievement = () => {
    if (newAchievement.title.trim() && user) {
      const updatedAchievements = [...(user.achievements || []), { ...newAchievement }];
      setUser({ ...user, achievements: updatedAchievements });
      setNewAchievement({ title: '', description: '', category: 'personal', icon: '🏆' });
      setShowAchievementForm(false);
    }
  };

  const handleRemoveAchievement = (index: number) => {
    if (!user) return;
    const updatedAchievements = user.achievements?.filter((_, i) => i !== index) || [];
    setUser({ ...user, achievements: updatedAchievements });
  };

  const handleAddEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim() && user) {
      const updatedEducation = [...(user.education || []), { ...newEducation }];
      setUser({ ...user, education: updatedEducation });
      setNewEducation({ degree: '', institution: '', startDate: '', endDate: '', current: false, gpa: 0, description: '' });
      setShowEducationForm(false);
    }
  };

  const handleRemoveEducation = (index: number) => {
    if (!user) return;
    const updatedEducation = user.education?.filter((_, i) => i !== index) || [];
    setUser({ ...user, education: updatedEducation });
  };

  const handleAddExperience = () => {
    if (newExperience.jobTitle.trim() && newExperience.company.trim() && user) {
      const updatedExperience = [...(user.experience || []), { ...newExperience }];
      setUser({ ...user, experience: updatedExperience });
      setNewExperience({ jobTitle: '', company: '', startDate: '', endDate: '', current: false, description: '', location: '', employmentType: 'Full-time' });
      setShowExperienceForm(false);
    }
  };

  const handleRemoveExperience = (index: number) => {
    if (!user) return;
    const updatedExperience = user.experience?.filter((_, i) => i !== index) || [];
    setUser({ ...user, experience: updatedExperience });
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let response;

      if (profilePicFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('profilePicture', profilePicFile);
        formData.append('user', JSON.stringify(user)); // send other fields as JSON string

        // Debug: print all FormData entries
        console.log('=== FormData Debug ===');
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }
        console.log('=== End FormData Debug ===');

        response = await fetch('/api/users/profile', {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
      } else {
        // Fallback to JSON if no file
        console.log('=== JSON Debug ===');
        console.log('Sending user data as JSON:', user);
        console.log('=== End JSON Debug ===');
        
        response = await fetch('/api/users/profile', {
          method: "PUT",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Try to get response body for debugging
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      if (!response.ok) {
        console.error('Error response:', responseText);
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }
      
      // Try to parse response as JSON if it's not empty
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }
      
      await refreshUser(); // Refresh user info from backend
      onSave(user);
      onOpenChange(false);
      
      setProfilePicFile(null); // Reset file state after save
    } catch (error) {
      console.error("Error saving profile:", error);
      // Optionally show an error toast/message here
    } finally {
      setLoading(false);
    }
  };
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.profilePicture} alt={user.fullname} />
                    <AvatarFallback>{user.fullname?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="profilePicture">Profile Picture</Label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="file"
                        id="profilePicInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setProfilePicFile(e.target.files[0]);
                            setUser({ ...user, profilePicture: URL.createObjectURL(e.target.files[0]) });
                          }
                        }}
                      />
                      <label htmlFor="profilePicInput">
                        <Button asChild variant="outline" size="sm">
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </span>
                        </Button>
                      </label>
                      <Button variant="outline" size="sm">
                        <Globe className="w-4 h-4 mr-2" />
                        URL
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      value={user.fullname}
                      onChange={(e) => handleInputChange('fullname', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={user.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={user.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={user.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={user.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={user.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowAchievementForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <Badge variant="outline" className="text-xs">{achievement.category}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAchievement(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information Tab */}
          <TabsContent value="professional" className="space-y-6">
            {/* Experience Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowExperienceForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.experience?.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{exp.jobTitle}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExperience(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Role-specific Information */}
            {user.role === 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={user.studentInfo?.university || ''}
                        onChange={(e) => handleNestedInputChange('studentInfo', 'university', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        value={user.studentInfo?.major || ''}
                        onChange={(e) => handleNestedInputChange('studentInfo', 'major', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minor">Minor</Label>
                      <Input
                        id="minor"
                        value={user.studentInfo?.minor || ''}
                        onChange={(e) => handleNestedInputChange('studentInfo', 'minor', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        value={user.studentInfo?.graduationYear || ''}
                        onChange={(e) => handleNestedInputChange('studentInfo', 'graduationYear', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentYear">Current Year</Label>
                      <Select 
                        value={user.studentInfo?.currentYear || ''} 
                        onValueChange={(value) => handleNestedInputChange('studentInfo', 'currentYear', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Freshman">Freshman</SelectItem>
                          <SelectItem value="Sophomore">Sophomore</SelectItem>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                          <SelectItem value="Alumni">Alumni</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="gpa">GPA</Label>
                      <Input
                        id="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={user.studentInfo?.gpa || ''}
                        onChange={(e) => handleNestedInputChange('studentInfo', 'gpa', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === 'recruiter' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={user.recruiterInfo?.companyName || ''}
                        onChange={(e) => handleNestedInputChange('recruiterInfo', 'companyName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={user.recruiterInfo?.designation || ''}
                        onChange={(e) => handleNestedInputChange('recruiterInfo', 'designation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={user.recruiterInfo?.department || ''}
                        onChange={(e) => handleNestedInputChange('recruiterInfo', 'department', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={user.recruiterInfo?.industry || ''}
                        onChange={(e) => handleNestedInputChange('recruiterInfo', 'industry', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyWebsite">Company Website</Label>
                      <Input
                        id="companyWebsite"
                        value={user.recruiterInfo?.companyWebsite || ''}
                        onChange={(e) => handleNestedInputChange('recruiterInfo', 'companyWebsite', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select 
                        value={user.recruiterInfo?.companySize || ''} 
                        onValueChange={(value) => handleNestedInputChange('recruiterInfo', 'companySize', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="companyDescription">Company Description</Label>
                    <Textarea
                      id="companyDescription"
                      value={user.recruiterInfo?.companyDescription || ''}
                      onChange={(e) => handleNestedInputChange('recruiterInfo', 'companyDescription', e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowEducationForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.education?.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </p>
                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={user.socialLinks?.linkedin || ''}
                      onChange={(e) => handleNestedInputChange('socialLinks', 'linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={user.socialLinks?.github || ''}
                      onChange={(e) => handleNestedInputChange('socialLinks', 'github', e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={user.socialLinks?.twitter || ''}
                      onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personalWebsite">Personal Website</Label>
                    <Input
                      id="personalWebsite"
                      value={user.socialLinks?.personalWebsite || ''}
                      onChange={(e) => handleNestedInputChange('socialLinks', 'personalWebsite', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio">Portfolio</Label>
                    <Input
                      id="portfolio"
                      value={user.socialLinks?.portfolio || ''}
                      onChange={(e) => handleNestedInputChange('socialLinks', 'portfolio', e.target.value)}
                      placeholder="https://portfolio.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Add Achievement Dialog */}
        <Dialog open={showAchievementForm} onOpenChange={setShowAchievementForm}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Add Achievement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="achievementTitle">Title</Label>
                <Input
                  id="achievementTitle"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="achievementDescription">Description</Label>
                <Textarea
                  id="achievementDescription"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="achievementCategory">Category</Label>
                <Select 
                  value={newAchievement.category} 
                  onValueChange={(value) => setNewAchievement({ ...newAchievement, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="award">Award</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAchievementForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAchievement}>
                  Add Achievement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Education Dialog */}
        <Dialog open={showEducationForm} onOpenChange={setShowEducationForm}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Add Education</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="eduDegree">Degree</Label>
                <Input
                  id="eduDegree"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="eduInstitution">Institution</Label>
                <Input
                  id="eduInstitution"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eduStartDate">Start Date</Label>
                  <Input
                    id="eduStartDate"
                    type="date"
                    value={newEducation.startDate}
                    onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="eduEndDate">End Date</Label>
                  <Input
                    id="eduEndDate"
                    type="date"
                    value={newEducation.endDate}
                    onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                    disabled={newEducation.current}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="eduCurrent"
                  checked={newEducation.current}
                  onChange={(e) => setNewEducation({ ...newEducation, current: e.target.checked })}
                />
                <Label htmlFor="eduCurrent">Currently studying here</Label>
              </div>
              <div>
                <Label htmlFor="eduGPA">GPA</Label>
                <Input
                  id="eduGPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={newEducation.gpa}
                  onChange={(e) => setNewEducation({ ...newEducation, gpa: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="eduDescription">Description</Label>
                <Textarea
                  id="eduDescription"
                  value={newEducation.description}
                  onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEducationForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEducation}>
                  Add Education
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Experience Dialog */}
        <Dialog open={showExperienceForm} onOpenChange={setShowExperienceForm}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Add Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="expJobTitle">Job Title</Label>
                <Input
                  id="expJobTitle"
                  value={newExperience.jobTitle}
                  onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expCompany">Company</Label>
                <Input
                  id="expCompany"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expStartDate">Start Date</Label>
                  <Input
                    id="expStartDate"
                    type="date"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expEndDate">End Date</Label>
                  <Input
                    id="expEndDate"
                    type="date"
                    value={newExperience.endDate}
                    onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                    disabled={newExperience.current}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="expCurrent"
                  checked={newExperience.current}
                  onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                />
                <Label htmlFor="expCurrent">Currently working here</Label>
              </div>
              <div>
                <Label htmlFor="expLocation">Location</Label>
                <Input
                  id="expLocation"
                  value={newExperience.location}
                  onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expType">Employment Type</Label>
                <Select 
                  value={newExperience.employmentType} 
                  onValueChange={(value) => setNewExperience({ ...newExperience, employmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expDescription">Description</Label>
                <Textarea
                  id="expDescription"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowExperienceForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExperience}>
                  Add Experience
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm; 
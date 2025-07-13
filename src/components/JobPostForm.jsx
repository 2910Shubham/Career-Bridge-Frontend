import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const JobPostForm = ({ onSubmit, isOpen, onOpenChange }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobLocation: "",
    jobType: "Full-time",
    salaryRange: "",
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    skillsRequired: [],
    applicationDeadline: "",
    jobStatus: "Open",
  });
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.type === "blur") && newSkill.trim()) {
      if (!formData.skillsRequired.includes(newSkill.trim())) {
        setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, newSkill.trim()] });
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skillsRequired: formData.skillsRequired.filter((s) => s !== skill) });
  };

  const handleSubmit = () => {
    if (formData.jobTitle && formData.jobDescription && formData.jobLocation) {
      onSubmit(formData);
      setFormData({
        jobTitle: "",
        jobDescription: "",
        jobLocation: "",
        jobType: "Full-time",
        salaryRange: "",
        companyName: "",
        companyDescription: "",
        companyWebsite: "",
        skillsRequired: [],
        applicationDeadline: "",
        jobStatus: "Open",
      });
      setNewSkill("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Job Title *</label>
              <Input
                placeholder="e.g. Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Job Location *</label>
              <Input
                placeholder="e.g. New York, NY or Remote"
                value={formData.jobLocation}
                onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Job Type *</label>
              <Select value={formData.jobType} onValueChange={(value) => setFormData({ ...formData, jobType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Salary Range *</label>
              <Input
                placeholder="e.g. $100k - $140k"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Application Deadline *</label>
              <Input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Company Name *</label>
              <Input
                placeholder="e.g. TechCorp Solutions"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Company Website</label>
              <Input
                placeholder="e.g. https://techcorp.com"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Company Description</label>
            <Textarea
              placeholder="Brief description of your company..."
              value={formData.companyDescription}
              onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Job Description *</label>
            <Textarea
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              className="min-h-[120px]"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Required Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skillsRequired.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
                  {skill}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Add a skill and press Enter..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              onBlur={handleAddSkill}
            />
          </div>

          {/* Job Status */}
          {/* <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Job Status</label>
            <Select value={formData.jobStatus} onValueChange={(value) => setFormData({ ...formData, jobStatus: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Submit Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.jobTitle || !formData.jobDescription || !formData.jobLocation}
            >
              Create Job Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobPostForm; 
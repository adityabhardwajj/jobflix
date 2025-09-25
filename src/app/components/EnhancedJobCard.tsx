'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  Share2, 
  Eye,
  Building2,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import { Button, Chip, Card, CardBody, Avatar } from '@heroui/react';

interface Job {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  logo: string;
  accentColor: string;
  role: string;
  roleColor: string;
  description?: string;
  requirements?: string[];
  postedDate?: string;
  experience?: string;
  skills?: string[];
  isRemote?: boolean;
  isUrgent?: boolean;
  companySize?: string;
  companyRating?: number;
  companyIndustry?: string;
  companyFounded?: string;
  companyDescription?: string;
}

interface EnhancedJobCardProps {
  job: Job;
  onSave?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
}

// Generate a company-themed background image
const generateCompanyImage = (company: string, role: string) => {
  const colors = {
    frontend: ['4F46E5', '7C3AED'], // Indigo to Purple
    backend: ['059669', '0D9488'], // Emerald to Teal
    design: ['DC2626', 'EC4899'], // Red to Pink
    fullstack: ['7C2D12', 'EA580C'], // Brown to Orange
    devops: ['B45309', 'D97706'], // Amber to Yellow
    data: ['1E40AF', '3730A3'], // Blue to Indigo
  };
  
  const roleColors = colors[role as keyof typeof colors] || colors.frontend;
  const companyInitial = company.charAt(0).toUpperCase();
  
  return `https://via.placeholder.com/400x300/${roleColors[0]}/${roleColors[1]}?text=${companyInitial}`;
};

export default function EnhancedJobCard({ job, onSave, onApply }: EnhancedJobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = () => {
    onApply?.(job.id);
  };

  const getRoleColor = (role: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    const colors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
      frontend: 'primary',
      backend: 'success',
      design: 'secondary',
      fullstack: 'warning',
      devops: 'danger',
      data: 'primary'
    };
    return colors[role as keyof typeof colors] || 'primary';
  };

  const formatRole = (role: string | undefined) => {
    if (!role) return 'Developer';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const companyImage = generateCompanyImage(job.company, job.role || 'frontend');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <DirectionAwareHover
        imageUrl={companyImage}
        className="h-80 w-full rounded-xl border border-default-200/60 bg-content1/90 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300"
        childrenClassName="p-6 text-white"
      >
        {/* Overlay Content */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                src={job.logo}
                alt={job.company}
                size="sm"
                className="border-2 border-white/20"
                fallback={job.company.charAt(0)}
              />
              <div>
                <h3 className="text-lg font-bold text-white line-clamp-1">
                  {job.title}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-white/90 flex items-center gap-1 font-semibold">
                    <Building2 size={14} />
                    {job.company}
                  </p>
                  {job.companyIndustry && (
                    <p className="text-xs text-white/70">
                      {job.companyIndustry} • {job.companySize || 'Growing team'}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Bookmark 
                size={16}
                className={isSaved ? 'fill-white text-white' : 'text-white/80'}
              />
            </motion.button>
          </div>

          {/* Job Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white/90">
              <MapPin size={14} />
              <span className="text-sm">{job.location}</span>
              {job.isRemote && (
                <Chip size="sm" color="success" variant="flat" className="text-xs">
                  Remote
                </Chip>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-white/90">
              <DollarSign size={14} />
              <span className="text-sm font-semibold">{job.salary}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white/90">
              <Clock size={14} />
              <span className="text-sm">{job.type}</span>
            </div>
          </div>

          {/* Skills */}
          {job.skills && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill) => (
                <Chip
                  key={skill}
                  size="sm"
                  variant="flat"
                  className="bg-white/10 text-white text-xs border border-white/20"
                >
                  {skill}
                </Chip>
              ))}
              {job.skills.length > 3 && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-white/10 text-white text-xs border border-white/20"
                >
                  +{job.skills.length - 3}
                </Chip>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              onClick={handleApply}
              color="primary"
              size="sm"
              endContent={<ArrowRight size={14} />}
              className="flex-1 bg-white text-gray-900 hover:bg-white/90 font-semibold"
            >
              Apply Now
            </Button>
            
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
            >
              <Share2 size={14} />
            </Button>
            
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
            >
              <Eye size={14} />
            </Button>
          </div>
        </div>
      </DirectionAwareHover>

      {/* Static Card Content (visible when not hovered) */}
      <div className="absolute inset-0 p-6 rounded-xl bg-content1 border border-default-200/60 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                src={job.logo}
                alt={job.company}
                size="sm"
                fallback={job.company.charAt(0)}
              />
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">
                  {job.title}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-foreground flex items-center gap-1 font-semibold">
                    <Building2 size={14} />
                    {job.company}
                  </p>
                  {job.companyIndustry && (
                    <p className="text-xs text-default-500">
                      {job.companyIndustry} • {job.companySize || 'Growing team'}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {job.isUrgent && (
                <Chip size="sm" color="danger" variant="flat">
                  Urgent
                </Chip>
              )}
              <Chip size="sm" color={getRoleColor(job.role || 'frontend')} variant="flat">
                {formatRole(job.role)}
              </Chip>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-default-600">
              <MapPin size={14} />
              <span className="text-sm">{job.location}</span>
              {job.isRemote && (
                <Chip size="sm" color="success" variant="flat" className="text-xs">
                  Remote
                </Chip>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-default-600">
              <DollarSign size={14} />
              <span className="text-sm font-semibold text-success">{job.salary}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-default-600">
              <Clock size={14} />
              <span className="text-sm">{job.type}</span>
            </div>
          </div>

          {/* Skills */}
          {job.skills && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill) => (
                <Chip
                  key={skill}
                  size="sm"
                  variant="flat"
                  color="default"
                  className="text-xs"
                >
                  {skill}
                </Chip>
              ))}
              {job.skills.length > 3 && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="default"
                  className="text-xs"
                >
                  +{job.skills.length - 3}
                </Chip>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-default-200">
            <div className="flex items-center space-x-4 text-xs text-default-500">
              <div className="flex items-center space-x-1">
                <Users size={12} />
                <span>{job.companySize || '500+ employees'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-warning fill-warning" />
                <span>{job.companyRating || '4.8'}</span>
              </div>
              {job.companyFounded && (
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>Est. {job.companyFounded}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-default-500">
              {job.postedDate || 'Posted 2 days ago'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
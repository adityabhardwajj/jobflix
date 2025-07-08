'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  File,
  FileType,
  HardDrive,
  Copy,
  Share2,
  Settings,
  Search,
  Filter
} from 'lucide-react';

interface Resume {
  id: string;
  name: string;
  type: 'resume' | 'cover_letter';
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  lastModified: string;
  isDefault: boolean;
  isPublic: boolean;
  tags: string[];
  description?: string;
  version: string;
  downloadCount: number;
}

interface ResumeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadResume?: (file: File, metadata: Partial<Resume>) => void;
  onDeleteResume?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

const mockResumes: Resume[] = [
  {
    id: "1",
    name: "Senior Frontend Developer Resume",
    type: "resume",
    fileName: "john_doe_frontend_resume.pdf",
    fileSize: "245 KB",
    fileType: "PDF",
    uploadDate: "2024-01-15",
    lastModified: "2024-01-18",
    isDefault: true,
    isPublic: true,
    tags: ["Frontend", "React", "Senior"],
    description: "Updated resume highlighting React and TypeScript experience",
    version: "2.1",
    downloadCount: 12
  },
  {
    id: "2",
    name: "Cover Letter - Tech Companies",
    type: "cover_letter",
    fileName: "cover_letter_tech.pdf",
    fileSize: "156 KB",
    fileType: "PDF",
    uploadDate: "2024-01-10",
    lastModified: "2024-01-12",
    isDefault: false,
    isPublic: false,
    tags: ["Cover Letter", "Tech"],
    description: "Generic cover letter for technology companies",
    version: "1.0",
    downloadCount: 5
  },
  {
    id: "3",
    name: "Full Stack Developer Resume",
    type: "resume",
    fileName: "john_doe_fullstack_resume.pdf",
    fileSize: "312 KB",
    fileType: "PDF",
    uploadDate: "2024-01-08",
    lastModified: "2024-01-15",
    isDefault: false,
    isPublic: true,
    tags: ["Full Stack", "Node.js", "React"],
    description: "Resume focused on full-stack development skills",
    version: "1.5",
    downloadCount: 8
  },
  {
    id: "4",
    name: "Cover Letter - Startup",
    type: "cover_letter",
    fileName: "cover_letter_startup.pdf",
    fileSize: "134 KB",
    fileType: "PDF",
    uploadDate: "2024-01-05",
    lastModified: "2024-01-05",
    isDefault: false,
    isPublic: false,
    tags: ["Cover Letter", "Startup"],
    description: "Cover letter tailored for startup companies",
    version: "1.0",
    downloadCount: 3
  }
];

const ResumeManager: React.FC<ResumeManagerProps> = ({
  isOpen,
  onClose,
  onUploadResume,
  onDeleteResume,
  onSetDefault
}) => {
  const [resumes, setResumes] = useState<Resume[]>(mockResumes);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'resume' | 'cover_letter'>('all');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    name: '',
    type: 'resume' as 'resume' | 'cover_letter',
    description: '',
    tags: [] as string[],
    isPublic: false
  });

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = 
      resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || resume.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadMetadata(prev => ({
        ...prev,
        name: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
      }));
    }
  };

  const handleUpload = () => {
    if (uploadFile && uploadMetadata.name) {
      const newResume: Resume = {
        id: Date.now().toString(),
        name: uploadMetadata.name,
        type: uploadMetadata.type,
        fileName: uploadFile.name,
        fileSize: `${Math.round(uploadFile.size / 1024)} KB`,
        fileType: uploadFile.name.split('.').pop()?.toUpperCase() || 'PDF',
        uploadDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        isDefault: resumes.filter(r => r.type === uploadMetadata.type).length === 0,
        isPublic: uploadMetadata.isPublic,
        tags: uploadMetadata.tags,
        description: uploadMetadata.description,
        version: "1.0",
        downloadCount: 0
      };

      setResumes(prev => [...prev, newResume]);
      setShowUpload(false);
      setUploadFile(null);
      setUploadMetadata({
        name: '',
        type: 'resume',
        description: '',
        tags: [],
        isPublic: false
      });

      if (onUploadResume) {
        onUploadResume(uploadFile, newResume);
      }
    }
  };

  const handleDeleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    if (onDeleteResume) onDeleteResume(id);
  };

  const handleSetDefault = (id: string) => {
    setResumes(prev => 
      prev.map(r => ({
        ...r,
        isDefault: r.type === resumes.find(res => res.id === id)?.type && r.id === id
      }))
    );
    if (onSetDefault) onSetDefault(id);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return FileText;
      case 'doc': return File;
      case 'docx': return File;
      default: return FileType;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resume': return 'text-blue-600 dark:text-blue-400';
      case 'cover_letter': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'resume': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'cover_letter': return 'bg-green-100 dark:bg-green-900/20';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Manager</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your resumes and cover letters</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload New
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resumes and cover letters..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="resume">Resumes</option>
                <option value="cover_letter">Cover Letters</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredResumes.length} of {resumes.length} documents
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[60vh]">
            {filteredResumes.map((resume) => {
              const FileIcon = getFileIcon(resume.fileType);
              return (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${getTypeBg(resume.type)}`}>
                        <FileIcon className={`w-6 h-6 ${getTypeColor(resume.type)}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {resume.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resume.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {resume.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          Default
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedResume(resume);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {resume.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {resume.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {resume.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div>
                      <span className="font-medium">Size:</span> {resume.fileSize}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {resume.fileType}
                    </div>
                    <div>
                      <span className="font-medium">Version:</span> {resume.version}
                    </div>
                    <div>
                      <span className="font-medium">Downloads:</span> {resume.downloadCount}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSetDefault(resume.id)}
                        disabled={resume.isDefault}
                        className={`p-2 rounded-lg transition-colors ${
                          resume.isDefault
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={resume.isDefault ? 'Already default' : 'Set as default'}
                      >
                        <Star className={`w-4 h-4 ${resume.isDefault ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => {/* Handle download */}}
                        className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Document</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document Type
                    </label>
                    <select
                      value={uploadMetadata.type}
                      onChange={(e) => setUploadMetadata(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="resume">Resume</option>
                      <option value="cover_letter">Cover Letter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={uploadMetadata.name}
                      onChange={(e) => setUploadMetadata(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter document name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={uploadMetadata.description}
                      onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Add a description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      {uploadFile ? (
                        <div className="space-y-2">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">{uploadFile.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {(uploadFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            PDF, DOC, DOCX (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={uploadMetadata.isPublic}
                      onChange={(e) => setUploadMetadata(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Make this document public
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowUpload(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile || !uploadMetadata.name}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResumeManager; 
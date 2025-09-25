"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardBody,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner
} from '@heroui/react'
import {
  Search,
  MapPin,
  Bookmark,
  BookmarkX,
  ExternalLink,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react'
import { Pagination, PaginationInfo } from '@/components/ui/pagination'
import { motion, AnimatePresence } from 'framer-motion'

interface SavedJob {
  id: string
  createdAt: string
  job: {
    id: string
    title: string
    description: string
    location: string
    type: string
    salary?: string
    remote: boolean
    createdAt: string
    company: {
      id: string
      name: string
      logo?: string
      size?: string
      industry?: string
    }
  }
}

export default function SavedJobsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchSavedJobs()
    }
  }, [status, searchParams])

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(locationFilter && { location: locationFilter }),
        ...(typeFilter && { type: typeFilter })
      })

      const response = await fetch(`/api/saved-jobs?${params}`)
      if (response.ok) {
        const result = await response.json()
        setSavedJobs(result.data || [])
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsaveJob = async (jobId: string) => {
    try {
      const savedJob = savedJobs.find(sj => sj.job.id === jobId)
      if (!savedJob) return

      const response = await fetch(`/api/saved-jobs/${savedJob.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSavedJobs(prev => prev.filter(sj => sj.job.id !== jobId))
        // Refresh the list to update pagination
        fetchSavedJobs()
      }
    } catch (error) {
      console.error('Error unsaving job:', error)
    }
  }

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to page 1 when filters change (except when changing page)
    if (!newParams.page) {
      params.delete('page')
    }
    
    router.push(`/saved-jobs?${params.toString()}`)
  }

  const handleSearch = () => {
    updateURL({
      search: searchQuery,
      location: locationFilter,
      type: typeFilter
    })
  }

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() })
  }

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full_time':
        return 'success'
      case 'part_time':
        return 'warning'
      case 'contract':
        return 'primary'
      case 'internship':
        return 'secondary'
      default:
        return 'default'
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Saved Jobs
          </h1>
          <p className="text-default-600">
            Manage your saved job opportunities
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-content1">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search saved jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  startContent={<Search size={20} className="text-default-400" />}
                  className="md:col-span-2"
                  variant="bordered"
                />
                <Input
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  startContent={<MapPin size={20} className="text-default-400" />}
                  variant="bordered"
                />
                <Select
                  placeholder="Job Type"
                  selectedKeys={typeFilter ? [typeFilter] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string
                    setTypeFilter(selected || '')
                    setTimeout(() => {
                      updateURL({
                        search: searchQuery,
                        location: locationFilter,
                        type: selected || ''
                      })
                    }, 100)
                  }}
                  variant="bordered"
                >
                  <SelectItem key="FULL_TIME">Full Time</SelectItem>
                  <SelectItem key="PART_TIME">Part Time</SelectItem>
                  <SelectItem key="CONTRACT">Contract</SelectItem>
                  <SelectItem key="INTERNSHIP">Internship</SelectItem>
                </Select>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  color="primary"
                  onPress={handleSearch}
                  startContent={<Search size={16} />}
                >
                  Search
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-foreground">
              {loading ? 'Loading...' : `${pagination.totalItems} Saved Jobs`}
            </h2>
            {savedJobs.length > 0 && (
              <Chip color="primary" variant="flat" size="sm">
                {pagination.totalItems} total
              </Chip>
            )}
          </div>
        </motion.div>

        {/* Job Cards */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : savedJobs.length > 0 ? (
            <motion.div
              key="jobs-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {savedJobs.map((savedJob, index) => (
                <motion.div
                  key={savedJob.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-content1 hover:shadow-lg transition-shadow">
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {savedJob.job.company.logo ? (
                            <img
                              src={savedJob.job.company.logo}
                              alt={savedJob.job.company.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-content2 rounded-lg flex items-center justify-center">
                              <Building2 size={20} className="text-default-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">
                              {savedJob.job.company.name}
                            </h3>
                            <p className="text-xs text-default-500">
                              {savedJob.job.company.industry}
                            </p>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleUnsaveJob(savedJob.job.id)}
                        >
                          <BookmarkX size={16} />
                        </Button>
                      </div>

                      <h4 className="font-semibold text-foreground mb-2">
                        {savedJob.job.title}
                      </h4>

                      <div className="flex items-center space-x-4 text-sm text-default-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{savedJob.job.location}</span>
                        </div>
                        {savedJob.job.salary && (
                          <div className="flex items-center space-x-1">
                            <DollarSign size={14} />
                            <span>{savedJob.job.salary}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <Chip
                          color={getJobTypeColor(savedJob.job.type)}
                          variant="flat"
                          size="sm"
                        >
                          {savedJob.job.type.replace('_', ' ')}
                        </Chip>
                        {savedJob.job.remote && (
                          <Chip color="secondary" variant="flat" size="sm">
                            Remote
                          </Chip>
                        )}
                      </div>

                      <p className="text-sm text-default-600 mb-4 line-clamp-2">
                        {savedJob.job.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-default-500 mb-4">
                        <span>Saved {new Date(savedJob.createdAt).toLocaleDateString()}</span>
                        <span>Posted {new Date(savedJob.job.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          color="primary"
                          size="sm"
                          className="flex-1"
                          onPress={() => router.push(`/jobs/${savedJob.job.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="bordered"
                          size="sm"
                          isIconOnly
                          onPress={() => window.open(`/jobs/${savedJob.job.id}`, '_blank')}
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-content2 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="w-12 h-12 text-default-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No saved jobs found
                </h3>
                <p className="text-default-600 mb-6">
                  Start saving jobs you're interested in to see them here
                </p>
                <Button
                  color="primary"
                  onPress={() => router.push('/jobs')}
                >
                  Browse Jobs
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && savedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
          >
            <PaginationInfo
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              className="text-center"
            />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="justify-center"
            />
          </motion.div>
        )}
      </div>

    </div>
  )
}

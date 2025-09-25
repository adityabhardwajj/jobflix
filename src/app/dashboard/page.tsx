"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardBody,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner
} from '@heroui/react'
import { 
  Briefcase, 
  Users,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { Pagination, PaginationInfo } from '@/components/ui/pagination'
import { motion } from 'framer-motion'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  savedJobs: number
  unreadNotifications: number
}

interface Application {
  id: string
  status: string
  createdAt: string
  job: {
    title: string
    company: {
      name: string
      logo?: string
    }
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, pagination.currentPage])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats and applications in parallel
      const [statsResponse, applicationsResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch(`/api/applications?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`)
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json()
        setApplications(applicationsData.data || [])
        setPagination(applicationsData.pagination)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning'
      case 'reviewing':
        return 'primary'
      case 'interview':
        return 'secondary'
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'danger'
      default:
        return 'default'
    }
  }

  if (status === 'loading' || loading) {
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
            Welcome back, {session.user?.name}!
              </h1>
          <p className="text-default-600">
            Here's what's happening with your job search
          </p>
          </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Total Applications',
                value: stats.totalApplications,
                icon: Briefcase,
                color: 'primary'
              },
              {
                title: 'Pending Reviews',
                value: stats.pendingApplications,
                icon: Clock,
                color: 'warning'
              },
              {
                title: 'Saved Jobs',
                value: stats.savedJobs,
                icon: Users,
                color: 'secondary'
              },
              {
                title: 'Notifications',
                value: stats.unreadNotifications,
                icon: TrendingUp,
                color: 'success'
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={stat.title} className="bg-content1">
                  <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm text-default-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                  </p>
                </div>
                      <div className={`p-3 rounded-full bg-${stat.color}/10`}>
                        <IconComponent className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
                  </CardBody>
                </Card>
              )
            })}
          </motion.div>
        )}

        {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
          <Card className="bg-content1">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Applications
                </h2>
                <Button
                  color="primary"
                  startContent={<Plus size={16} />}
                  onPress={() => router.push('/jobs')}
                >
                  Apply to Jobs
                </Button>
            </div>

              {applications.length > 0 ? (
                <>
                  <Table aria-label="Recent applications">
                    <TableHeader>
                      <TableColumn>JOB TITLE</TableColumn>
                      <TableColumn>COMPANY</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                      <TableColumn>APPLIED DATE</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium text-foreground">
                              {application.job.title}
                        </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {application.job.company.logo && (
                                <img
                                  src={application.job.company.logo}
                                  alt={application.job.company.name}
                                  className="w-6 h-6 rounded"
                                />
                              )}
                              <span className="text-default-600">
                                {application.job.company.name}
                            </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={getStatusColor(application.status)}
                              variant="flat"
                              size="sm"
                            >
                              {application.status}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <span className="text-default-600">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                        <div className="flex items-center space-x-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => router.push(`/applications/${application.id}`)}
                              >
                                <Eye size={16} />
                              </Button>
                        </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="mt-6 space-y-4">
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
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-default-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No applications yet
                  </h3>
                  <p className="text-default-600 mb-4">
                    Start applying to jobs to see them here
                  </p>
                  <Button
                    color="primary"
                    onPress={() => router.push('/jobs')}
                  >
                    Browse Jobs
                  </Button>
                  </div>
                )}
            </CardBody>
          </Card>
          </motion.div>
      </div>
    </div>
  )
} 
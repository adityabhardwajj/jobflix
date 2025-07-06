"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = "h-4 bg-gray-200 dark:bg-gray-700", count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`animate-pulse rounded ${className}`}
        />
      ))}
    </>
  );
}

export function JobCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Gradient Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-4">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Job Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Company Stats */}
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Skeleton className="flex-1 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
}

export function NewsCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        {/* Meta Information */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center space-x-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-20" />
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="flex-1 h-14 rounded-xl" />
        <Skeleton className="w-full lg:w-64 h-14 rounded-xl" />
        <Skeleton className="w-full lg:w-32 h-14 rounded-xl" />
      </div>
    </motion.div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
} 
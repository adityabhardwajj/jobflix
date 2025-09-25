import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Pagination utilities
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export function calculatePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage
  }
}

export function getPaginationFromSearchParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
  
  return { page, limit }
}

// URL utilities for pagination
export function createPaginationUrl(
  baseUrl: string,
  page: number,
  searchParams?: URLSearchParams
) {
  const url = new URL(baseUrl, window.location.origin)
  
  // Copy existing search params
  if (searchParams) {
    searchParams.forEach((value, key) => {
      if (key !== 'page') {
        url.searchParams.set(key, value)
      }
    })
  }
  
  // Set the page
  if (page > 1) {
    url.searchParams.set('page', page.toString())
  }
  
  return url.pathname + url.search
}
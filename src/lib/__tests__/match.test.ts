import { describe, it, expect } from 'vitest';
import { calculateCompatibility } from '../match';
import { UserProfile, Job } from '../schemas';

describe('Compatibility Calculation', () => {
  const sampleProfile: UserProfile = {
    id: 'user-1',
    name: 'John Doe',
    title: 'Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js'],
    years: 3,
    location: 'San Francisco, CA',
    desiredSalary: 120000,
    availability: 'immediate',
    completion: 100
  };

  const sampleJob: Job = {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    logoUrl: 'https://example.com/logo.png',
    salaryRange: { min: 100000, max: 150000, currency: 'USD' },
    location: 'San Francisco, CA',
    tags: ['React', 'TypeScript', 'CSS'],
    description: 'Frontend developer position',
    createdAt: new Date().toISOString(),
    compatibility: 0
  };

  it('should calculate high compatibility for matching skills and location', () => {
    const compatibility = calculateCompatibility(sampleProfile, sampleJob);
    expect(compatibility).toBeGreaterThan(70);
  });

  it('should calculate lower compatibility for mismatched location', () => {
    const remoteJob = { ...sampleJob, location: 'Remote' };
    const compatibility = calculateCompatibility(sampleProfile, remoteJob);
    expect(compatibility).toBeGreaterThan(50);
  });

  it('should calculate lower compatibility for mismatched skills', () => {
    const backendJob = { 
      ...sampleJob, 
      tags: ['Python', 'Django', 'PostgreSQL'] 
    };
    const compatibility = calculateCompatibility(sampleProfile, backendJob);
    expect(compatibility).toBeLessThan(50);
  });

  it('should return a number between 0 and 100', () => {
    const compatibility = calculateCompatibility(sampleProfile, sampleJob);
    expect(compatibility).toBeGreaterThanOrEqual(0);
    expect(compatibility).toBeLessThanOrEqual(100);
  });
});

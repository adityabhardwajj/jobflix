import { UserProfile, Job } from './schemas';

export interface CompatibilityWeights {
  skillOverlap: number;
  locationFit: number;
  seniorityDelta: number;
  recencyBonus: number;
}

export const defaultWeights: CompatibilityWeights = {
  skillOverlap: 0.6,
  locationFit: 0.2,
  seniorityDelta: 0.1,
  recencyBonus: 0.1
};

export function calculateCompatibility(
  profile: UserProfile,
  job: Job,
  weights: CompatibilityWeights = defaultWeights
): number {
  const skillScore = calculateSkillOverlap(profile.skills, job.tags);
  const locationScore = calculateLocationFit(profile.location, job.location);
  const seniorityScore = calculateSeniorityMatch(profile.years, job.tags);
  const recencyScore = calculateRecencyBonus(job.createdAt);

  const totalScore = 
    (skillScore * weights.skillOverlap) +
    (locationScore * weights.locationFit) +
    (seniorityScore * weights.seniorityDelta) +
    (recencyScore * weights.recencyBonus);

  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

function calculateSkillOverlap(profileSkills: string[], jobTags: string[]): number {
  if (profileSkills.length === 0 || jobTags.length === 0) return 0;
  
  const normalizedProfileSkills = profileSkills.map(skill => skill.toLowerCase().trim());
  const normalizedJobTags = jobTags.map(tag => tag.toLowerCase().trim());
  
  const matches = normalizedProfileSkills.filter(skill => 
    normalizedJobTags.some(tag => 
      tag.includes(skill) || skill.includes(tag) || 
      areSimilarSkills(skill, tag)
    )
  );
  
  return (matches.length / Math.max(profileSkills.length, jobTags.length)) * 100;
}

function areSimilarSkills(skill1: string, skill2: string): boolean {
  const skillMap: Record<string, string[]> = {
    'javascript': ['js', 'es6', 'es2015', 'node.js', 'nodejs'],
    'typescript': ['ts', 'typescript'],
    'react': ['reactjs', 'react.js'],
    'vue': ['vuejs', 'vue.js'],
    'angular': ['angularjs', 'angular.js'],
    'python': ['py', 'python3'],
    'java': ['java8', 'java11', 'spring'],
    'c#': ['csharp', 'dotnet', '.net'],
    'php': ['php7', 'php8'],
    'ruby': ['ruby on rails', 'rails'],
    'go': ['golang'],
    'rust': ['rustlang'],
    'swift': ['swiftui'],
    'kotlin': ['android'],
    'sql': ['mysql', 'postgresql', 'postgres', 'sqlite'],
    'nosql': ['mongodb', 'cassandra', 'redis'],
    'aws': ['amazon web services', 'ec2', 's3', 'lambda'],
    'azure': ['microsoft azure'],
    'gcp': ['google cloud', 'google cloud platform'],
    'docker': ['containers', 'containerization'],
    'kubernetes': ['k8s', 'kube'],
    'git': ['github', 'gitlab', 'bitbucket'],
    'ci/cd': ['continuous integration', 'continuous deployment', 'jenkins', 'github actions'],
    'agile': ['scrum', 'kanban', 'sprint'],
    'tdd': ['test driven development', 'unit testing'],
    'api': ['rest', 'graphql', 'microservices'],
    'mobile': ['ios', 'android', 'react native', 'flutter'],
    'ui/ux': ['user interface', 'user experience', 'figma', 'sketch', 'adobe xd'],
    'data': ['analytics', 'big data', 'machine learning', 'ai', 'ml']
  };
  
  const skill1Lower = skill1.toLowerCase();
  const skill2Lower = skill2.toLowerCase();
  
  // Direct match
  if (skill1Lower === skill2Lower) return true;
  
  // Check if one skill is in the other's similar skills
  for (const [key, similarSkills] of Object.entries(skillMap)) {
    if (skill1Lower === key && similarSkills.includes(skill2Lower)) return true;
    if (skill2Lower === key && similarSkills.includes(skill1Lower)) return true;
  }
  
  return false;
}

function calculateLocationFit(profileLocation: string, jobLocation: string): number {
  const profileLower = profileLocation.toLowerCase();
  const jobLower = jobLocation.toLowerCase();
  
  // Exact match
  if (profileLower === jobLower) return 100;
  
  // Remote work bonus
  if (jobLower.includes('remote') || jobLower.includes('anywhere')) return 80;
  
  // City/state match
  const profileCity = extractCity(profileLocation);
  const jobCity = extractCity(jobLocation);
  
  if (profileCity && jobCity && profileCity === jobCity) return 90;
  
  // State/region match
  const profileState = extractState(profileLocation);
  const jobState = extractState(jobLocation);
  
  if (profileState && jobState && profileState === jobState) return 70;
  
  // Country match
  const profileCountry = extractCountry(profileLocation);
  const jobCountry = extractCountry(jobLocation);
  
  if (profileCountry && jobCountry && profileCountry === jobCountry) return 50;
  
  return 0;
}

function extractCity(location: string): string | null {
  const parts = location.split(',').map(part => part.trim());
  return parts[0] || null;
}

function extractState(location: string): string | null {
  const parts = location.split(',').map(part => part.trim());
  return parts[1] || null;
}

function extractCountry(location: string): string | null {
  const parts = location.split(',').map(part => part.trim());
  return parts[parts.length - 1] || null;
}

function calculateSeniorityMatch(profileYears: number, jobTags: string[]): number {
  const seniorityKeywords = {
    junior: ['junior', 'entry', 'associate', 'trainee', 'intern'],
    mid: ['mid', 'intermediate', 'regular', 'standard'],
    senior: ['senior', 'lead', 'principal', 'staff', 'architect'],
    executive: ['executive', 'director', 'vp', 'vice president', 'cto', 'ceo']
  };
  
  let expectedLevel = 'mid'; // Default
  
  for (const [level, keywords] of Object.entries(seniorityKeywords)) {
    if (jobTags.some(tag => keywords.some(keyword => 
      tag.toLowerCase().includes(keyword)
    ))) {
      expectedLevel = level;
      break;
    }
  }
  
  const levelRanges = {
    junior: { min: 0, max: 3 },
    mid: { min: 2, max: 7 },
    senior: { min: 5, max: 15 },
    executive: { min: 10, max: 25 }
  };
  
  const range = levelRanges[expectedLevel as keyof typeof levelRanges];
  
  if (profileYears >= range.min && profileYears <= range.max) {
    return 100;
  } else if (profileYears < range.min) {
    return Math.max(0, 100 - (range.min - profileYears) * 20);
  } else {
    return Math.max(0, 100 - (profileYears - range.max) * 10);
  }
}

function calculateRecencyBonus(createdAt: string): number {
  const now = new Date();
  const jobDate = new Date(createdAt);
  const daysDiff = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) return 100;
  if (daysDiff <= 7) return 80;
  if (daysDiff <= 30) return 60;
  if (daysDiff <= 90) return 40;
  return 20;
}

export function sortJobsByCompatibility(jobs: Job[]): Job[] {
  return jobs.sort((a, b) => b.compatibility - a.compatibility);
}

export function filterJobsByCompatibility(jobs: Job[], minCompatibility: number = 30): Job[] {
  return jobs.filter(job => job.compatibility >= minCompatibility);
}

export function getTopMatchingJobs(jobs: Job[], limit: number = 10): Job[] {
  return sortJobsByCompatibility(jobs).slice(0, limit);
}

'use client';

import JobFlixCards from './JobFlixCards';
import { jobFlixCardsData } from '../data/cards';

export default function JobFlixCardsWrapper() {
  return <JobFlixCards cards={jobFlixCardsData} />;
}


export type CardType = 'job' | 'news' | 'project' | 'idea' | 'assistant';

export type IconName = 'briefcase' | 'users' | 'newspaper' | 'lightbulb' | 'bot';

export interface JobFlixCardData {
  id: string;
  type: CardType;
  title: string;
  subtitle: string;
  description: string;
  iconName: IconName;
  href: string;
  badge?: string;
  stats?: {
    label: string;
    value: string | number;
  };
  gradient?: string; // Optional gradient class for variety
}

export interface CardGridProps {
  cards: JobFlixCardData[];
  className?: string;
}

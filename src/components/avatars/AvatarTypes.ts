export interface AvatarProps {
  size?: number;
  className?: string;
}

export const avatarList = [
  { id: 'explorer', name: 'Explorer', description: 'Adventure seeker with compass and hiking gear' },
  { id: 'detective', name: 'Detective', description: 'Mystery solver with magnifying glass' },
  { id: 'scholar', name: 'Scholar', description: 'Academic with books and graduation cap' },
  { id: 'adventurer', name: 'Adventurer', description: 'Action-ready with map and compass' },
  { id: 'techie', name: 'Techie', description: 'Tech enthusiast with smart gadgets' },
  { id: 'artist', name: 'Artist', description: 'Creative type with paint and brushes' }
] as const;

export type AvatarId = typeof avatarList[number]['id']; 
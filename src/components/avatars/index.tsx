export { ExplorerAvatar } from './ExplorerAvatar';
export { DetectiveAvatar } from './DetectiveAvatar';
export { ScholarAvatar } from './ScholarAvatar';
export { AdventurerAvatar } from './AdventurerAvatar';
export { TechieAvatar } from './TechieAvatar';
export { ArtistAvatar } from './ArtistAvatar';

export { avatarList } from './AvatarTypes';
export type { AvatarProps, AvatarId } from './AvatarTypes';

import { ExplorerAvatar } from './ExplorerAvatar';
import { DetectiveAvatar } from './DetectiveAvatar';
import { ScholarAvatar } from './ScholarAvatar';
import { AdventurerAvatar } from './AdventurerAvatar';
import { TechieAvatar } from './TechieAvatar';
import { ArtistAvatar } from './ArtistAvatar';
import { AvatarId } from './AvatarTypes';

export const avatarComponents = {
  explorer: ExplorerAvatar,
  detective: DetectiveAvatar,
  scholar: ScholarAvatar,
  adventurer: AdventurerAvatar,
  techie: TechieAvatar,
  artist: ArtistAvatar,
} as const;

export function getAvatarComponent(avatarId: AvatarId) {
  return avatarComponents[avatarId];
} 
import { useState, useEffect, useCallback } from 'react';
import { AvatarId, avatarList } from '../components/avatars/AvatarTypes';

const AVATAR_STORAGE_KEY = 'gofind-user-avatar';

interface UseAvatarReturn {
  selectedAvatar: AvatarId | null;
  setSelectedAvatar: (avatarId: AvatarId) => void;
  clearAvatar: () => void;
  isAvatarSelected: boolean;
  getRandomAvatar: () => AvatarId;
  avatarData: typeof avatarList[number] | null;
}

export const useAvatar = (): UseAvatarReturn => {
  const [selectedAvatar, setSelectedAvatarState] = useState<AvatarId | null>(null);

  // Load avatar from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (stored && avatarList.some(avatar => avatar.id === stored)) {
      setSelectedAvatarState(stored as AvatarId);
    }
  }, []);

  // Save avatar to localStorage when it changes
  const setSelectedAvatar = useCallback((avatarId: AvatarId) => {
    setSelectedAvatarState(avatarId);
    localStorage.setItem(AVATAR_STORAGE_KEY, avatarId);
  }, []);

  // Clear avatar selection
  const clearAvatar = useCallback(() => {
    setSelectedAvatarState(null);
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  }, []);

  // Get random avatar
  const getRandomAvatar = useCallback((): AvatarId => {
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    return avatarList[randomIndex].id;
  }, []);

  // Get avatar data for the selected avatar
  const avatarData = selectedAvatar 
    ? avatarList.find(avatar => avatar.id === selectedAvatar) || null
    : null;

  return {
    selectedAvatar,
    setSelectedAvatar,
    clearAvatar,
    isAvatarSelected: selectedAvatar !== null,
    getRandomAvatar,
    avatarData,
  };
}; 
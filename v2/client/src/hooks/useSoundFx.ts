"use client";

/**
 * Audio disabled per site configuration.
 */
export function useSoundFx() {
  return {
    audioEnabled: false,
    toggleAudio: () => {},
    playHapticBeep: () => {},
  };
}


// Simple utility to play notification sounds

let audioContext: AudioContext | null = null;

// Initialize audio context on user interaction
export const initializeAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Web Audio API is not supported in this browser', error);
    }
  }
  return audioContext;
};

// Play a notification sound
export const playNotificationSound = (volume = 0.5) => {
  const context = initializeAudioContext();
  if (!context) return;
  
  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, context.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);
  } catch (error) {
    console.error('Failed to play notification sound', error);
  }
};

// Check if sound notifications are enabled in user settings
export const shouldPlaySound = (): boolean => {
  try {
    const settingsString = localStorage.getItem('userSettings');
    if (!settingsString) return true; // Default to true if no settings
    
    const settings = JSON.parse(settingsString);
    return settings.soundNotifications !== false; // Default to true unless explicitly disabled
  } catch (e) {
    return true; // Default to true if any error occurs
  }
};

// Main function to play notification sound if enabled
export const playSound = () => {
  if (shouldPlaySound()) {
    playNotificationSound(0.3);
  }
};

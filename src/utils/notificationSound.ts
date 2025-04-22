
import type { Howl } from 'howler';

let notificationSound: Howl | null = null;

export async function initNotificationSound() {
  if (!notificationSound) {
    const { Howl } = await import('howler');
    notificationSound = new Howl({
      src: ['/sounds/notification.mp3'],
      volume: 0.7,
    });
  }
}

export function playNotificationSound() {
  if (!notificationSound) {
    initNotificationSound();
    return;
  }
  notificationSound.play();
}


import { Howl } from 'howler';

export const notificationSound = new Howl({
  src: ['/sounds/notification.mp3'],
  volume: 0.7,
});

export function playNotificationSound() {
  notificationSound.play();
}

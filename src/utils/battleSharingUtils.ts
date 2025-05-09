
import { toast } from "@/components/ui/sonner";

export const shareWithContacts = (inviteCode: string) => {
  if (!inviteCode) return;
  
  const message = `Join my roast battle on GetRoasted! Use code: ${inviteCode}`;
  
  // Check if we can use the Share API
  if (navigator.share) {
    navigator.share({
      title: "Join my Roast Battle",
      text: message,
    }).catch((err) => {
      console.error('Error sharing:', err);
      fallbackShare(message, inviteCode);
    });
  } else {
    fallbackShare(message, inviteCode);
  }
};

const fallbackShare = (message: string, inviteCode: string) => {
  // Create a modal or dialog with options to share
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
  const emailUrl = `mailto:?subject=Join my Roast Battle&body=${encodeURIComponent(message)}`;
  
  // Open a small window with sharing options
  const shareWindow = window.open("", "Share", "width=600,height=400");
  if (shareWindow) {
    shareWindow.document.write(`
      <html>
        <head>
          <title>Share Battle Invitation</title>
          <style>
            body { font-family: Arial, sans-serif; background: #111; color: white; padding: 20px; }
            h2 { color: #ff5722; }
            .btn { display: block; margin: 10px 0; padding: 10px; background: #333; color: white; text-decoration: none; border-radius: 5px; }
            .btn:hover { background: #444; }
          </style>
        </head>
        <body>
          <h2>Share Battle Invitation</h2>
          <a href="${whatsappUrl}" class="btn" target="_blank">Share via WhatsApp</a>
          <a href="${twitterUrl}" class="btn" target="_blank">Share via Twitter</a>
          <a href="${emailUrl}" class="btn" target="_blank">Share via Email</a>
          <p style="margin-top: 20px;">Or copy this code:</p>
          <input type="text" value="${inviteCode || ''}" style="width: 100%; padding: 5px; font-size: 24px; text-align: center;" onclick="this.select();">
        </body>
      </html>
    `);
  } else {
    // If popup blocked, just copy to clipboard
    navigator.clipboard.writeText(message);
    toast.success("Battle code copied to clipboard", {
      description: "Share it with your friends"
    });
  }
};

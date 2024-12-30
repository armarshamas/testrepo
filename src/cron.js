import { publishScheduledContent } from './services/publisher.js';
import bot from './bot.js';

// Check for scheduled content every minute
setInterval(async () => {
  const result = await publishScheduledContent();
  if (result) {
    const { subscribers, content } = result;
    // Notify subscribers of new content
    subscribers?.forEach(sub => {
      bot.sendMessage(sub.telegram_id, 
        `🆕 New Content Published!\n\n${content.title}\n${content.description}`
      );
    });
  }
}, 60000);
import * as schedulerService from '../services/scheduler.js';
import { isAdmin } from '../utils/auth.js';

export const handleScheduleContent = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) return;
  
  const args = msg.text.split('\n');
  if (args.length < 3) {
    bot.sendMessage(msg.chat.id, 
      'Usage: /schedule\n<title>\n<description>\nYYYY-MM-DD HH:mm'
    );
    return;
  }

  const [_, title, description, dateStr] = args;
  const publishAt = new Date(dateStr);
  
  if (isNaN(publishAt.getTime())) {
    bot.sendMessage(msg.chat.id, '❌ Invalid date format.');
    return;
  }

  const { error } = await schedulerService.scheduleContent(
    { title, description },
    publishAt
  );

  if (!error) {
    bot.sendMessage(msg.chat.id, 
      `✅ Content scheduled for ${publishAt.toLocaleString()}`
    );
  }
};

export const handleListScheduled = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) return;
  
  const scheduled = await schedulerService.getScheduledContent();
  if (!scheduled?.length) {
    bot.sendMessage(msg.chat.id, 'No scheduled content.');
    return;
  }

  const scheduleList = scheduled
    .map(item => 
      `📅 ${item.title}\n` +
      `Scheduled for: ${new Date(item.publish_at).toLocaleString()}`
    )
    .join('\n\n');
  
  bot.sendMessage(msg.chat.id, 
    `Scheduled Content:\n\n${scheduleList}`
  );
};
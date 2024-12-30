import { config } from '../config.js';
import * as db from '../services/supabase.js';

const isAdmin = (userId) => userId.toString() === config.adminUserId;

export const handleAddContent = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) return;
  
  const chatId = msg.chat.id;
  const content = msg.text.split('/addContent ')[1];
  
  if (!content) {
    bot.sendMessage(chatId, 'Please provide content in format: title | description');
    return;
  }

  const [title, description] = content.split('|').map(s => s.trim());
  
  const { error } = await db.addContent({ title, description });
  if (!error) {
    bot.sendMessage(chatId, '✅ Content added successfully!');
    notifySubscribers(bot, title, description);
  }
};

export const handleStats = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) return;
  
  const chatId = msg.chat.id;
  const { userCount, subscriberCount } = await db.getUserStats();

  bot.sendMessage(chatId, 
    `📊 Bot Statistics\n\n` +
    `Total Users: ${userCount}\n` +
    `Subscribers: ${subscriberCount}`
  );
};

export const handleMedia = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) return;
  
  const chatId = msg.chat.id;
  
  if (msg.photo || msg.video || msg.document) {
    const mediaType = msg.photo ? 'photo' : msg.video ? 'video' : 'document';
    const mediaId = msg.photo ? msg.photo[0].file_id : 
                   msg.video ? msg.video.file_id :
                   msg.document.file_id;
    
    const { error } = await db.addContent({
      type: mediaType,
      file_id: mediaId,
      description: msg.caption || ''
    });

    if (!error) {
      bot.sendMessage(chatId, '✅ Media content added successfully!');
    }
  }
};

const notifySubscribers = async (bot, title, description) => {
  const subscribers = await db.getSubscribers();
  subscribers?.forEach(sub => {
    bot.sendMessage(sub.telegram_id, 
      `🆕 New Content Added!\n\n${title}\n${description}`);
  });
};
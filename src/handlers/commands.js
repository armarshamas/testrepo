import * as db from '../services/supabase.js';

export const handleStart = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const user = await db.getUser(userId);
  if (!user) {
    await db.createUser(userId, msg.from.username);
  }

  const welcomeMessage = `Welcome to the Content Sharing Bot! 🎉\n\n` +
    `Commands:\n` +
    `/subscribe - Subscribe to content\n` +
    `/content - View available content\n` +
    `/chat - Join community chat`;
  
  bot.sendMessage(chatId, welcomeMessage);
};

export const handleSubscribe = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const { error } = await db.updateSubscription(userId, true);
  if (!error) {
    bot.sendMessage(chatId, '✅ You are now subscribed to receive content updates!');
  }
};

export const handleContent = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const user = await db.getUser(userId);
  if (!user?.is_subscribed) {
    bot.sendMessage(chatId, '⚠️ Please /subscribe first to access content.');
    return;
  }

  const content = await db.getContent();
  if (content?.length > 0) {
    const contentList = content.map(item => 
      `📝 ${item.title}\n${item.description}\n\n`
    ).join('');
    
    bot.sendMessage(chatId, `Latest Content:\n\n${contentList}`);
  } else {
    bot.sendMessage(chatId, 'No content available yet.');
  }
};
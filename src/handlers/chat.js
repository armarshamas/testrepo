import { config } from '../config.js';
import * as db from '../services/supabase.js';

const isAdmin = (userId) => userId.toString() === config.adminUserId;

export const handleJoinChat = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const user = await db.getUser(userId);
  if (!user?.is_subscribed) {
    bot.sendMessage(chatId, '⚠️ Please /subscribe first to join the community chat.');
    return;
  }

  // Generate chat invite link with 1-day expiry
  const chatInviteLink = await bot.createChatInviteLink(config.communityGroupId, {
    expire_date: Math.floor(Date.now() / 1000) + 86400,
    member_limit: 1
  });
  
  bot.sendMessage(chatId, 
    `🎉 Welcome to our community!\n\n` +
    `Click the link below to join (valid for 24 hours):\n` +
    `${chatInviteLink.invite_link}`
  );
};

export const handleModeration = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) return;
  
  // Delete message if it contains banned words
  if (msg.text && containsBannedWords(msg.text)) {
    await bot.deleteMessage(msg.chat.id, msg.message_id);
    await bot.sendMessage(msg.chat.id, 
      '⚠️ Message deleted due to inappropriate content.',
      { reply_to_message_id: msg.message_id }
    );
  }
};

export const handleBanUser = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) return;
  
  const args = msg.text.split(' ');
  if (args.length < 2) {
    bot.sendMessage(msg.chat.id, 'Usage: /ban @username reason');
    return;
  }

  const username = args[1].replace('@', '');
  const reason = args.slice(2).join(' ') || 'No reason provided';
  
  try {
    await bot.banChatMember(config.communityGroupId, msg.reply_to_message.from.id);
    bot.sendMessage(msg.chat.id, 
      `🚫 User @${username} has been banned.\nReason: ${reason}`
    );
  } catch (error) {
    bot.sendMessage(msg.chat.id, '❌ Failed to ban user. Please try again.');
  }
};

const containsBannedWords = (text) => {
  const bannedWords = ['spam', 'offensive', 'inappropriate']; // Add more words as needed
  return bannedWords.some(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
};
import TelegramBot from 'node-telegram-bot-api';
import { config } from './config.js';
import * as commands from './handlers/commands.js';
import * as admin from './handlers/admin.js';
import * as chat from './handlers/chat.js';
import * as categories from './handlers/categories.js';
import * as scheduler from './handlers/scheduler.js';

const bot = new TelegramBot(config.telegramToken, { polling: true });

// Basic commands
bot.onText(/^\/start/, (msg) => commands.handleStart(bot, msg));
bot.onText(/^\/subscribe/, (msg) => commands.handleSubscribe(bot, msg));
bot.onText(/^\/content$/, (msg) => commands.handleContent(bot, msg));
bot.onText(/^\/content (.+)/, (msg, match) => 
  categories.handleCategoryContent(bot, msg, match[1])
);
bot.onText(/^\/categories/, (msg) => categories.handleListCategories(bot, msg));
bot.onText(/^\/chat/, (msg) => chat.handleJoinChat(bot, msg));

// Admin commands
bot.onText(/^\/addContent/, (msg) => admin.handleAddContent(bot, msg));
bot.onText(/^\/stats/, (msg) => admin.handleStats(bot, msg));
bot.onText(/^\/ban/, (msg) => chat.handleBanUser(bot, msg));
bot.onText(/^\/schedule/, (msg) => scheduler.handleScheduleContent(bot, msg));
bot.onText(/^\/scheduled/, (msg) => scheduler.handleListScheduled(bot, msg));

// Message handlers
bot.on('message', (msg) => {
  if (msg.chat.type === 'supergroup') {
    chat.handleModeration(bot, msg);
  } else {
    admin.handleMedia(bot, msg);
  }
});

export default bot;
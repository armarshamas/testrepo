import * as categoryService from '../services/categories.js';

export const handleListCategories = async (bot, msg) => {
  const chatId = msg.chat.id;
  const categories = await categoryService.getCategories();
  
  if (!categories?.length) {
    bot.sendMessage(chatId, 'No categories available.');
    return;
  }

  const categoryList = categories
    .map(cat => `📁 ${cat.name}\n${cat.description || ''}`)
    .join('\n\n');
  
  bot.sendMessage(chatId, 
    `Available Categories:\n\n${categoryList}\n\n` +
    `Use /content <category> to view content`
  );
};

export const handleCategoryContent = async (bot, msg, categoryName) => {
  const chatId = msg.chat.id;
  const categories = await categoryService.getCategories();
  const category = categories?.find(c => 
    c.name.toLowerCase() === categoryName.toLowerCase()
  );
  
  if (!category) {
    bot.sendMessage(chatId, '❌ Category not found.');
    return;
  }

  const content = await categoryService.getCategoryContent(category.id);
  if (!content?.length) {
    bot.sendMessage(chatId, 'No content available in this category.');
    return;
  }

  const contentList = content
    .map(item => `📝 ${item.title}\n${item.description || ''}`)
    .join('\n\n');
  
  bot.sendMessage(chatId, 
    `Content in ${category.name}:\n\n${contentList}`
  );
};
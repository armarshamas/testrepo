import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  adminUserId: process.env.ADMIN_USER_ID,
  communityGroupId: process.env.COMMUNITY_GROUP_ID // Add this to .env
};
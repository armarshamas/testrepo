import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

export const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export const getUser = async (telegramId) => {
  const { data } = await supabase
    .from('users')
    .select()
    .eq('telegram_id', telegramId)
    .single();
  return data;
};

export const createUser = async (telegramId, username) => {
  return await supabase.from('users').insert({
    telegram_id: telegramId,
    username,
    is_subscribed: false
  });
};

export const updateSubscription = async (telegramId, isSubscribed) => {
  return await supabase
    .from('users')
    .update({ is_subscribed: isSubscribed })
    .eq('telegram_id', telegramId);
};

export const getContent = async (limit = 5) => {
  const { data } = await supabase
    .from('content')
    .select()
    .order('created_at', { ascending: false })
    .limit(limit);
  return data;
};

export const addContent = async (content) => {
  return await supabase.from('content').insert(content);
};

export const getSubscribers = async () => {
  const { data } = await supabase
    .from('users')
    .select('telegram_id')
    .eq('is_subscribed', true);
  return data;
};

export const getUserStats = async () => {
  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact' });
  
  const { count: subscriberCount } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('is_subscribed', true);

  return { userCount, subscriberCount };
};
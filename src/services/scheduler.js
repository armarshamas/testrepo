import { supabase } from './supabase.js';

export const scheduleContent = async (content, publishAt) => {
  return await supabase
    .from('scheduled_content')
    .insert({
      ...content,
      publish_at: publishAt,
      status: 'pending'
    });
};

export const getScheduledContent = async () => {
  const { data } = await supabase
    .from('scheduled_content')
    .select('*')
    .eq('status', 'pending')
    .order('publish_at');
  return data;
};

export const markAsPublished = async (id) => {
  return await supabase
    .from('scheduled_content')
    .update({ status: 'published' })
    .eq('id', id);
};
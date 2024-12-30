import { supabase } from './supabase.js';
import * as db from './supabase.js';

const publishScheduledContent = async () => {
  const now = new Date();
  
  // Get pending content due for publishing
  const { data: scheduledContent } = await supabase
    .from('scheduled_content')
    .select('*')
    .eq('status', 'pending')
    .lte('publish_at', now.toISOString());

  if (!scheduledContent?.length) return;

  // Publish each content item
  for (const content of scheduledContent) {
    await db.addContent({
      title: content.title,
      description: content.description,
      type: content.type,
      file_id: content.file_id,
      category_id: content.category_id
    });

    // Mark as published
    await supabase
      .from('scheduled_content')
      .update({ status: 'published' })
      .eq('id', content.id);

    // Notify subscribers
    const subscribers = await db.getSubscribers();
    return { subscribers, content };
  }
};

export { publishScheduledContent };
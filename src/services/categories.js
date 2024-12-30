import { supabase } from './supabase.js';

export const getCategories = async () => {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  return data;
};

export const addCategory = async (name, description) => {
  return await supabase
    .from('categories')
    .insert({ name, description });
};

export const getCategoryContent = async (categoryId) => {
  const { data } = await supabase
    .from('content')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });
  return data;
};
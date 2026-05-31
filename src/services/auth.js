import { supabase } from './supabase';

export async function signUp({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    display_name: displayName,
    email,
  });
  if (profileError) throw profileError;

  return user;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function checkDisplayNameAvailable(name) {
  const { data, error } = await supabase.rpc('is_display_name_available', {
    name,
  });
  if (error) throw error;
  return data;
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Minimal Supabase stub for build compatibility
// This file provides empty implementations when @supabase/supabase-js is not installed

export function createClient(url: string, key: string) {
  console.warn('Supabase package not available. Using localStorage fallback.');
  return {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not available') }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not available') }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not available') }) }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not available') }) }),
      order: () => Promise.resolve({ data: null, error: new Error('Supabase not available') })
    })
  };
}

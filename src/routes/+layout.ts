import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_PROJECT_ID } from '$env/static/public';
import { layoutLoad } from '$lib/supabase/util';

const PUBLIC_SUPABASE_URL = `https://${PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;

export const load = async ({ data, depends, fetch }) => {
  const supabaseLayoutLoad = await layoutLoad({
    cookies: data.cookies,
    depends,
    fetch,
    supabaseApiKey: PUBLIC_SUPABASE_API_KEY,
    supabaseUrl: PUBLIC_SUPABASE_URL
  });

  return {
    supabaseData: supabaseLayoutLoad,
  };
};

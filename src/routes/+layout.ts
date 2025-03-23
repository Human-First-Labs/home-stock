import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_PROJECT_ID } from '$env/static/public';
import { userService } from '$lib/api/user-service';
import { layoutLoad } from '$lib/supabase/util';

const PUBLIC_SUPABASE_URL = `https://${PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;

export const load = async ({ data, depends, fetch }) => {
  /**
   * Declare a dependency so the layout can be invalidated, for example, on
   * session refresh.
   */
  depends('supabase:auth');

  const apiService = userService(fetch);

  let user

  if (data.session) {
    try {
      const result = await apiService.getUser();

      user = result.user
    } catch (e) {
      console.error(e)

    }
  }

  const supabaseLayoutLoad = await layoutLoad({
    cookies: data.cookies,
    fetch,
    supabaseApiKey: PUBLIC_SUPABASE_API_KEY,
    supabaseUrl: PUBLIC_SUPABASE_URL
  });

  return {
    supabaseData: supabaseLayoutLoad,
    user,
  };
};

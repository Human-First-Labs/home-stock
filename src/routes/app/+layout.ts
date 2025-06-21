import { getSDK } from '../../lib/api/index';
import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_PROJECT_ID } from '$env/static/public';
import { layoutLoad } from '$lib/supabase/util';

const PUBLIC_SUPABASE_URL = `https://${PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;


export const load = async ({ data, depends, fetch }) => {

    depends('supabase:auth');

    const supabaseLayoutLoad = await layoutLoad({
        cookies: data.cookies,
        fetch,
        supabaseApiKey: PUBLIC_SUPABASE_API_KEY,
        supabaseUrl: PUBLIC_SUPABASE_URL
    });

    const apiSDK = getSDK(fetch, data.session?.access_token || '')

    let user

    if (data.session) {
        try {
            const result = await apiSDK.users.getUser()

            user = result.user
        } catch (e) {
            console.error(e)

        }

    }


    return {
        user,
        supabaseData: supabaseLayoutLoad,
    };
};


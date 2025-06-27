import type { Fetch } from "@supabase/supabase-js/dist/module/lib/types"
import { PUBLIC_API_URL } from '$env/static/public';


export const utilityService = (fetch: Fetch) => {

    return {
        checkAPI: async () => {
            return (await fetch(PUBLIC_API_URL + '/health', {
                'method': 'GET',
            })).json() as Promise<{
                active: boolean
            }>
        }
    }

}
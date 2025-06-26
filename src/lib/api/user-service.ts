import type { Fetch } from "@supabase/supabase-js/dist/module/lib/types"
import type { User } from "./types"
import { PUBLIC_API_URL } from '$env/static/public';


export const userService = (fetch: Fetch) => {

    return {
        getUser: async () => {
            return (await fetch(PUBLIC_API_URL + '/get/my-user', {
                'method': 'GET',
            })).json() as Promise<{
                user: User | undefined
            }>
        }
    }

}
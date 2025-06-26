import type { PageServerLoad } from "./items/$types"

export const load: PageServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession()

  return {
    session,
    user,
    cookies: cookies.getAll(),
  }
}

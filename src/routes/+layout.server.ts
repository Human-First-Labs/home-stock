import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  return {
    //NEEDED FOR NO FLICKER
    cookies: cookies.getAll()
  };
};

import { userService } from '$lib/api/user-service.js';

export const load = async ({ fetch }) => {
  const apiService = userService(fetch);

  const result = await apiService.getUser();

  return {
    user: result.user,
  };
};

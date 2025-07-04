import { isBrowser, createBrowserClient, createServerClient } from '@supabase/ssr';
import { type Handle } from '@sveltejs/kit';

export interface DataArguments {
	fetch: {
		(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
		(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
	};
	supabaseUrl: string;
	supabaseApiKey: string;
	cookies: {
		name: string;
		value: string;
	}[];
}

export const getSupabaseInstance = (args: DataArguments) => {
	const { fetch, cookies, supabaseUrl, supabaseApiKey } = args;

	return isBrowser()
		? createBrowserClient(supabaseUrl, supabaseApiKey, {
			global: {
				fetch
			}
		})
		: createServerClient(supabaseUrl, supabaseApiKey, {
			global: {
				fetch
			},
			cookies: {
				getAll() {
					return cookies;
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => {
						cookies.push({ name, value });
					});
				}
			}
		});
}

export const layoutLoad = async (args: DataArguments) => {
	const { fetch, cookies, supabaseUrl, supabaseApiKey } = args;

	const supabase = getSupabaseInstance({
		fetch,
		cookies,
		supabaseUrl,
		supabaseApiKey
	})

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return { session, supabase, user };
};

export const generateSupabaseHandler = (args: { supabaseUrl: string; supabaseKey: string }) => {
	const { supabaseUrl, supabaseKey } = args;

	const supabaseHandler: Handle = async ({ event, resolve }) => {
		/**
		 * Creates a Supabase client specific to this server request.
		 *
		 * The Supabase client gets the Auth token from the request cookies.
		 */

		event.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
			cookies: {
				getAll: () => event.cookies.getAll(),
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						try {
							event.cookies.set(name, value, { ...options, path: '/' });
						} catch (e) {
							console.error('Error setting cookie:', e);
						}
					});
				}
			}
		});

		/**
		 * Unlike `supabase.auth.getSession()`, which returns the session _without_
		 * validating the JWT, this function also calls `getUser()` to validate the
		 * JWT before returning the session.
		 */
		event.locals.safeGetSession = async () => {
			const {
				data: { user },
				error
			} = await event.locals.supabase.auth.getUser();
			if (error) {
				// JWT validation has failed
				return { session: null, user: null };
			}

			const {
				data: { session }
			} = await event.locals.supabase.auth.getSession();
			if (!session) {
				return { session: null, user: null };
			}

			return { session, user };
		};

		return resolve(event, {
			filterSerializedResponseHeaders(name) {
				/**
				 * Supabase libraries use the `content-range` and `x-supabase-api-version`
				 * headers, so we need to tell SvelteKit to pass it through.
				 */
				return name === 'content-range' || name === 'x-supabase-api-version';
			}
		});
	};

	// const authGuard: Handle = async ({ event, resolve }) => {
	// 	const { session, user } = await event.locals.safeGetSession();
	// 	console.log('AT Auth Guard - ', session, user);

	// 	if (!session && event.url.pathname.startsWith('/app')) {
	// 		return redirect(303, '/');
	// 	}

	// 	return resolve(event);
	// };

	return {
		// authGuard,
		supabaseHandler
	};
};

// export const tokenFetchHandle: HandleFetch = async ({ request, fetch, event }) => {
// 	const { session } = await event.locals.safeGetSession();

// 	const newHeaders = new Headers(request.headers);

// 	newHeaders.append('authorization', `Bearer ${session ? session.access_token : PUBLIC_SUPABASE_API_KEY}`);

// 	const newRequest = new Request(request.url, {
// 		...request,
// 		headers: newHeaders
// 	});

// 	return fetch(newRequest);
// };

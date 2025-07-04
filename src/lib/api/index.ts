import { browser } from '$app/environment';
import { itemService } from './item-service';
import { receiptService } from './receipt-service';
import { userService } from './user-service';
import { utilityService } from './utility-service';
import { getSupabaseInstance, type DataArguments } from '$lib/supabase/util';

export type SvelteFetch = {
	(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
	(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
};

export const getSDK = (fetch: SvelteFetch, data?: DataArguments) => {
	const updatedFetch: SvelteFetch = async (url, request) => {

		let token = ''
		if (data) {
			const supabase = getSupabaseInstance(data)

			const session = await supabase.auth.getSession()
			token = session.data.session?.access_token || '';
		}

		if (browser) {

			const newRequest = new Request(url, request);
			try {
				return fetch(url, {
					...request,
					headers: new Headers({
						...Object.fromEntries(newRequest.headers), // Copy existing headers
						authorization: `Bearer ${token}`, // Add the authorization header
						'content-type': 'application/json' // Set the content type to JSON
					})
				});
			} catch (e) {
				console.error(e);
				return fetch(url, {
					...request,
					headers: new Headers({
						...Object.fromEntries(newRequest.headers), // Copy existing headers
						authorization: token ? `Bearer ${token}` : '', // Add the authorization header
						'content-type': 'application/json' // Set the content type to JSON
					})
				});
			}
		} else {
			return fetch(url, {
				...request,
				headers: new Headers({
					...Object.fromEntries(new Request(url, request).headers), // Copy existing headers
					'content-type': 'application/json' // Set the content type to JSON
				})
			})
		}
	}

	return {
		utilities: utilityService(updatedFetch),
		users: userService(updatedFetch),
		items: itemService(updatedFetch),
		receipt: receiptService(updatedFetch)

	};
};

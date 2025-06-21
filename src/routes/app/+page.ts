import { getSDK } from "$lib/api";

export const load = async ({ data, fetch }) => {
    const apiSDK = getSDK(fetch, data.session?.access_token || '')

    let currentScan

    if (data.session) {
        try {
            const result = await apiSDK.receipt.getCurrentLines()


            currentScan = result;

        } catch (e) {
            console.error(e)
        }
    }

    return {
        currentScan
    };
}
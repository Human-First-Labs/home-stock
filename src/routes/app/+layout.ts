import { getSDK } from '../../lib/api/index';

export const load = async ({ data, fetch }) => {


    const apiSDK = getSDK(fetch, data.session?.access_token || '')

    let user
    let currentScan

    if (data.session) {
        try {
            const result = await apiSDK.users.getUser()

            user = result.user
        } catch (e) {
            console.error(e)

        }

        try {
            const result = await apiSDK.receipt.getCurrentLines()
            console.log(result)
            currentScan = result
        } catch (e) {
            console.error(e)
        }
    }


    return {
        user,
        currentScan
    };
};

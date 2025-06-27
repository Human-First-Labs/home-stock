
import { getSDK } from "$lib/api";

export const load = async ({ fetch }) => {
    const apiSDK = getSDK(fetch, '')


    const checkActive = async () => {
        return await apiSDK.utilities.checkAPI()

    };



    return {
        checkActive,
    };
}
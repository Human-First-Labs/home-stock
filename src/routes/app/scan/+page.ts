import { invalidate } from "$app/navigation";
import { getSDK } from "$lib/api";

export const load = async ({ data, fetch, depends }) => {
    const apiSDK = getSDK(fetch, data.session?.access_token || '')

    depends('app:currentScan');

    let currentScan
    let scanNumbers

    if (data.session) {
        try {
            const result = await apiSDK.receipt.getCurrentLines()

            currentScan = result;

        } catch (e) {
            console.error(e)
        }

        try {
            const result = await apiSDK.receipt.getMonthScanNumber()


            scanNumbers = result;

        } catch (e) {
            console.error(e)
        }
    }

    const uploadScan = async (base64: string, extension: string) => {
        await apiSDK.receipt.uploadReceipt({
            base64,
            extension
        });
        invalidate('app:currentScan');
    }

    return {
        currentScan,
        scanNumbers,
        uploadScan
    };
}
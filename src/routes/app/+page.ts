
export const load = async ({ depends, parent }) => {
    const { apiSDK } = await parent();

    depends('app:currentScan');
    let currentScan
    let scanNumbers

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

    return {
        currentScan,
        scanNumbers
    };
}
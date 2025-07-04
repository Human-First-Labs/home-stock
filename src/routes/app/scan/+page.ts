import { invalidate } from "$app/navigation";
import type { ActionedInfoLine, ReceiptLineType } from "$lib/api/receipt-service";

export const load = async ({ depends, parent }) => {
    const { apiSDK } = await parent();

    depends('app:currentScan');

    let currentScan
    let scanNumbers
    let items

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

    try {
        const result = await apiSDK.items.getItems()

        items = result.items;

    } catch (e) {
        console.error(e)
    }

    const uploadScan = async (base64: string, extension: string) => {
        await apiSDK.receipt.uploadReceipt({
            base64,
            extension
        });
        invalidate('app:currentScan');
    }

    const cancelScan = async (id: string) => {
        await apiSDK.receipt.cancelReceiptScan(id);
        invalidate('app:currentScan');
    }

    const bulkConfirmFunc = async (id: string) => {
        await apiSDK.receipt.confirmReceipt(id)
        invalidate('app:currentScan');
    }

    const confirmScanLine = async (id: string, data: {
        actionedInfo: ActionedInfoLine;
        line: ReceiptLineType;
    }) => {
        await apiSDK.receipt.confirmReceiptLine(id, data)
        invalidate('app:currentScan');
    }

    const createItem = async (item: {
        title: string;
        warningAmount: number;
        quantity: number;
    }) => {
        const resultItem = await apiSDK.items.createItem(item);

        invalidate('app:currentScan');
        invalidate('app:items');

        return resultItem

    };


    return {
        currentScan,
        scanNumbers,
        items,
        uploadScan,
        cancelScan,
        bulkConfirmFunc,
        confirmScanLine,
        createItem
    };
}
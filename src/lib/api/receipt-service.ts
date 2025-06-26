import type { Fetch } from "@supabase/supabase-js/dist/module/lib/types"
import { PUBLIC_API_URL } from '$env/static/public';

export interface ActionedInfoLine {
    itemId?: string
    ignore?: boolean
}

export interface ReceiptLineType {
    title: string;
    sku: string | null;
    upc: string | null;
    hsn: string | null;
    reference: string | null;
    status: 'PENDING' | 'COMPLETED'
    quantity: number;
    actionableInfo: {
        existingItemTitle?: string
        existingItemId?: string
        ignore?: boolean
        quantityChange?: number
    }
}


export const receiptService = (fetch: Fetch) => {

    return {
        uploadReceipt: async (upload: {
            base64: string,
            extension: string,
        }) => {
            return (await fetch(PUBLIC_API_URL + '/upload/receipt', {
                'method': 'POST',
                body: JSON.stringify(upload)
            })).json() as Promise<void>
        },
        getCurrentLines: async () => {
            const result = await (await fetch(PUBLIC_API_URL + '/get/current/lines', {
                'method': 'GET',
            })).json() as Promise<{
                id: string,
                lines: ReceiptLineType[]
            } | undefined>

            return Object.keys(result).length > 0 ? result : undefined;
        },
        cancelReceiptScan: async (id: string) => {
            return (await fetch(PUBLIC_API_URL + '/cancel/receipt/' + id, {
                'method': 'PATCH',
            })).json() as Promise<{
                message: string
            }>
        },
        confirmReceipt: async (id: string) => {
            const result = await (await fetch(PUBLIC_API_URL + '/confirm/receipt/' + id, {
                'method': 'PATCH',
            })).json() as Promise<{
                unconfirmedLines: ReceiptLineType[]
            } | undefined>

            return Object.keys(result).length > 0 ? result : undefined;
        },
        confirmReceiptLine: async (scanId: string, data: {
            actionedInfo: ActionedInfoLine,
            line: ReceiptLineType
        }) => {
            const result = await (await fetch(PUBLIC_API_URL + '/confirm/receipt/line/' + scanId, {
                'method': 'PATCH',
                body: JSON.stringify(data)
            })).json() as Promise<{
                unconfirmedLines: ReceiptLineType[]
            } | undefined>

            return Object.keys(result).length > 0 ? result : undefined;
        },
        getMonthScanNumber: async () => {
            return (await fetch(PUBLIC_API_URL + '/get/month-scan-number', {
                'method': 'GET',
            })).json() as Promise<{
                number: number
            }>
        }
    }

}
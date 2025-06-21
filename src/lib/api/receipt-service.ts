import type { Fetch } from "@supabase/supabase-js/dist/module/lib/types"
import type { Item, User } from "./types"
import { PUBLIC_API_URL } from '$env/static/public';

export interface ActionedInfoLine {
    differentItemId?: string
    newItem?: Partial<Item>
    ignore?: boolean
}

export interface ReceiptLineType {
    title: string;
    sku: string | null;
    upc: string | null;
    hsn: string | null;
    reference: string | null;
    quantity: number;
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
            })).json() as Promise<{
                user: User | undefined
            }>
        },
        getCurrentLines: async () => {
            return (await fetch(PUBLIC_API_URL + '/get/current/lines', {
                'method': 'GET',
            })).json() as Promise<{
                id: string,
                lines: ReceiptLineType[]
            } | undefined>
        },
        cancelReceiptScan: async (id: string) => {
            return (await fetch(PUBLIC_API_URL + '/cancel/receipt/' + id, {
                'method': 'PATCH',
            })).json() as Promise<{
                message: string
            }>
        },
        confirmReceipt: async (id: string) => {
            return (await fetch(PUBLIC_API_URL + '/confirm/receipt/' + id, {
                'method': 'PATCH',
            })).json() as Promise<{
                unconfirmedLines: ReceiptLineType[]
            } | undefined>
        },
        confirmReceiptLine: async (scanId: string, data: {
            actionedInfo: ActionedInfoLine,
            line: ReceiptLineType
        }) => {
            return (await fetch(PUBLIC_API_URL + '/confirm/receipt/line/' + scanId, {
                'method': 'PATCH',
                body: JSON.stringify(data)
            })).json() as Promise<{
                unconfirmedLines: ReceiptLineType[]
            } | undefined>
        }
    }

}
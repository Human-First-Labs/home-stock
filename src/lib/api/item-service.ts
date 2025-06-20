import type { Fetch } from "@supabase/supabase-js/dist/module/lib/types"
import type { Item } from "./types"
import { PUBLIC_API_URL } from '$env/static/public';

export const itemService = (fetch: Fetch) => {

    return {
        createItem: async (product: {
            title: string,
            warningAmount: number,
            quantity: number
        }) => {
            return (await fetch(PUBLIC_API_URL + '/create/item', {
                'method': 'POST',
                body: JSON.stringify(
                    product
                )
            })).json() as Promise<{
                item: Item | undefined
            }>
        },
        createItemFromReceiptLine: async (receiptProduct: {
            title: string,
            warningAmount: number,
            quantity: number,
            receiptLineId: string,
        }) => {
            return (await fetch(PUBLIC_API_URL + '/create/item/from-receipt-line', {
                'method': 'POST',
                body: JSON.stringify(
                    receiptProduct
                )
            })).json() as Promise<{
                item: Item | undefined
            }>
        },
        updateItem: async (id: string, product: {
            title: string,
            warningAmount: number,
        }) => {
            return (await fetch(PUBLIC_API_URL + '/update/item/' + id, {
                'method': 'PATCH',
                body: JSON.stringify(
                    product
                )
            })).json() as Promise<{
                item: Item | undefined
            }>
        },
        updateItemQuantity: async (id: string, product: {
            quantityChange: number,
        }) => {
            return (await fetch(PUBLIC_API_URL + '/update/item/quantity/' + id, {
                'method': 'PATCH',
                body: JSON.stringify(
                    product
                )
            })).json() as Promise<{
                item: Item | undefined
            }>
        },
        deleteItem: async (id: string) => {
            return (await fetch(PUBLIC_API_URL + '/delete/item/' + id, {
                'method': 'DELETE',
            })).json() as Promise<{
                item: Item | undefined
            }>
        },
        generateShoppingList: async () => {
            return (await fetch(PUBLIC_API_URL + '/generate/shopping-list', {
                'method': 'POST'
            })).json() as Promise<{
                shoppingList: Item[] | undefined
            }>
        },
        getItems: async () => {
            return (await fetch(PUBLIC_API_URL + '/get/my-items', {
                'method': 'GET',
            })).json() as Promise<{
                items: Item[] | undefined
            }>
        },
        getShoppingLists: async () => {
            return (await fetch(PUBLIC_API_URL + '/get/my-shopping-lists', {
                'method': 'GET',
            })).json() as Promise<{
                shoppingList: Item[] | undefined
            }>
        },
        getShoppingList: async (id: string) => {
            return (await fetch(PUBLIC_API_URL + '/get/my-shopping-list/' + id, {
                'method': 'GET',
            })).json() as Promise<{
                shoppingList: Item
            }>
        }

    }

}
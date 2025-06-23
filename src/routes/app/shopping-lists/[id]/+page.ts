import { getSDK } from "$lib/api";

export const load = async ({ data, fetch, url }) => {
    const apiSDK = getSDK(fetch, data.session?.access_token || '')
    const id = url.pathname.split('/').pop();

    if (!id) {
        throw new Error("Shopping list ID is required");
    }

    let shoppingList

    try {
        const result = await apiSDK.items.getShoppingList(id);
        shoppingList = result.shoppingList;
    } catch (e) {
        console.error(e);
    }

    return {
        shoppingList
    };
}
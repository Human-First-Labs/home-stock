import { invalidate } from "$app/navigation";
import { getSDK } from "$lib/api";

export const load = async ({ data, depends, fetch }) => {
    const apiSDK = getSDK(fetch, data.session?.access_token || '')

    let shoppingLists

    depends('app:shopping-lists');
    try {
        const result = await apiSDK.items.getShoppingLists();
        shoppingLists = result.shoppingLists;
    } catch (e) {
        console.error(e);
    }

    const generateShoppingList = async () => {
        await apiSDK.items.generateShoppingList()

        invalidate('app:shopping-lists');
    };

    const deleteShoppingList = async (id: string) => {
        await apiSDK.items.deleteShoppingList(id);
        invalidate('app:shopping-lists');
    };


    return {
        shoppingLists,
        generateShoppingList,
        deleteShoppingList
    };
}
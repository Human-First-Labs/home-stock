import { invalidate } from "$app/navigation";

export const load = async ({ depends, parent }) => {
    const { apiSDK } = await parent();

    let shoppingLists

    depends('app:shopping-lists');
    try {
        const result = await apiSDK.items.getShoppingLists();
        shoppingLists = result.shoppingLists;
    } catch (e) {
        console.error(e);
    }

    const generateShoppingList = async () => {
        const result = await apiSDK.items.generateShoppingList()

        invalidate('app:shopping-lists');
        return result
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
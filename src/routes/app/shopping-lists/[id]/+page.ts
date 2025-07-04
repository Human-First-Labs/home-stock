export const load = async ({ url, parent }) => {
    const { apiSDK } = await parent();
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
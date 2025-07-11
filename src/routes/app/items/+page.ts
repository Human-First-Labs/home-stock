import { invalidate } from "$app/navigation";

export const load = async ({ depends, parent }) => {
    const { apiSDK } = await parent();

    let items

    depends('app:items');
    try {
        const result = await apiSDK.items.getItems();
        items = result.items;
    } catch (e) {
        console.error(e);
    }

    const createItem = async (item: {
        title: string;
        warningAmount: number;
        quantity: number;
    }) => {
        await apiSDK.items.createItem(item);

        invalidate('app:items');

    };

    const updateItem = async (id: string, item: {
        title: string;
        warningAmount: number;
        quantity: number;
    }) => {
        await apiSDK.items.updateItem(id, item);
        invalidate('app:items');
    };

    const updateItemQuantity = async (id: string, quantityChange: number) => {
        await apiSDK.items.updateItemQuantity(id, { quantityChange });
        invalidate('app:items');
    };

    const deleteItem = async (id: string) => {
        await apiSDK.items.deleteItem(id);
        invalidate('app:items');
    };


    return {
        items,
        createItem,
        updateItem,
        updateItemQuantity,
        deleteItem
    };
}
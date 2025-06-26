export interface User {
    id: string
    supabaseUid: string
    displayName: string
    blocked: boolean
    acceptedTermsOn: string
    contactInfo?: {
        email?: {
            email: string
            verified: boolean
        }
        phone?: {
            phone: string
            whatsapp: boolean
        }
    }
}

export interface Item {
    id: string
    title: string
    warningAmount: number
    quantity: number
    createdAt: string
    updatedAt: string
}

export interface ShoppingList {
    id: string
    items: {
        id: string
        title: string
        currentQuantity: number
        warningAmount: number
    }[]
    createdAt: string
}
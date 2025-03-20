export interface SocketEvent {
    id: string
    name: SocketEventName
    args?: {
        [key: string]: unknown
    }
}
export type SocketEventName = 'getUserById'


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
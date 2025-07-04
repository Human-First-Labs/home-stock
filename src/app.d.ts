// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import 'unplugin-icons/types/svelte';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { Socket } from 'socket.io-client';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      websocket?: Socket
    }
    // interface PageData {
    //   session: Session | null
    // }
    // interface PageState {}
    // interface Platform {}
  }
}

export { }
import type Router from 'core/router';
import type Storage from './utils/link-storage/storage';

declare global {
  interface Window {
    __socket: WebSocket
    memory: Storage
    router: Router
  }
  interface MemoryBI {
    loading: boolean,
    user: TUser,
    chats: Record<string,TChat>,
    eAPI: string | null,
    sAPI: string | null,
  }
  interface TReqError {
    reason: string
  }
  interface TUser {
    login: string
    first_name: string
    second_name: string
    display_name: string
    id: number
    avatar: string
    phone: string
    email: string
    role?: string
  }
  interface TChat {
    avatar: string | null
    created_by: number
    id: number
    last_message: string | null
    title: string
    unread_count: number
  }
  interface TChatBE {
    chat: TChat
    users: Record<number, TUser>
  }
  type TSignup = Omit<TUser, 'avatar' | 'display_name' | 'id'>  & {
    password: string
  }
}
  
export {};

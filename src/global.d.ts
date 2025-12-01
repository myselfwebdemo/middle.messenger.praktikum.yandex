import type Router from 'core/router';
import type Storage from './utils/link-storage/storage';
declare global {
  interface Window {
    __socket: WebSocket;
    memory: Storage;
    router: Router;
  }
}
  
export {};

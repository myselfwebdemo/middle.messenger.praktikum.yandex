declare global {
    interface Window {
      __socket: WebSocket;
    }
  }
  
export {};

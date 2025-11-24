import { clg } from 'main';
import { getChatToken } from 'services/service';

interface SocketParams {
    userId: number
    chatId: number
}
// export default class ChatConnection {
//     private baseURL = 'wss://ya-praktikum.tech/ws';
//     // private baseURL = ' https://ya-praktikum.tech/api/v2';

//     private socket: WebSocket | null = null;
//     private url: string;
//     private pingInterval: any = null;
//     private reconnectTimeout: any = null;
//     private onMessageHandler: (data: any) => void;
//     private isManualClose = false;
//     private chatId: number;
//     private userId: number;

//     constructor(params: SocketParams, onMessage: (data: any) => void) {
//         this.chatId = params.chatId;
//         this.userId = params.userId;

//         this.onMessageHandler = onMessage;
//         this.connect();
//     }
    
//     private async connect() {
//         // @ts-ignore
//         const { token } = await getChatToken(this.chatId);
//         this.url = `${this.baseURL}/chats/${this.userId}/${this.chatId}/${token}`;
//         this.socket = new WebSocket(this.url);

//         this.socket.addEventListener('open', () => {
//             clg('[Socket] open:', this.url);

//             this.requestHistory();
            
//             this.pingInterval = setInterval(() => {

//                 this.send({ type: 'ping' });
//             }, 15000);
//         });

//         this.socket.addEventListener('message', (e) => {
//             try {
//                 const data = JSON.parse(e.data);
//                 clg(data)
//                 this.onMessageHandler(data);
//             } catch {
//                 console.warn('Socket message parse fail:', e.data);
//             }
//         });

//         this.socket.addEventListener('close', (e) => {
//             clg('close event',e);
//             // clearInterval(this.pingInterval);
//             // this.pingInterval = null;

//             if (!this.isManualClose) {
//                 console.warn('[Socket] unexpected close, reconnecting...');
//                 // this.reconnect();
//             }
//         });

//         this.socket.addEventListener('error', (err) => {
//             console.error('[Socket] error:', err);
//         });
//     }
//     private reconnect() {
//         clearTimeout(this.reconnectTimeout);
//         this.reconnectTimeout = setTimeout(() => {
//             this.connect();
//         }, 2000);
//     }
//     private send(obj: any) {
//         if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
//         this.socket.send(JSON.stringify(obj));
//     }
//     public sendMessage(text: string) {
//         this.send({
//             type: 'message',
//             content: text,
//         });
//     }
//     public requestHistory() {
//         this.send({
//             content: '0',
//             type: 'get old',
//         });
//     }
//     public close() {
//         this.isManualClose = true;
//         clearInterval(this.pingInterval);
//         if (this.socket) this.socket.close();
//     }
// }

export const connectChat = async (params: SocketParams) => {
    const { token } = await getChatToken(params.chatId);
    const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${params.userId}/${params.chatId}/${token}`);

    socket.addEventListener('open', () => {
        clg('[Socket] opened');

        setInterval(() => {
            send({type: 'ping'});
        }, 5000);
        
        requestHistory(0);

        const sendBtn = document.querySelector('.button.u-send');
        // @ts-ignore
        sendBtn.addEventListener('click', () => {
            if (message.value !== '') {
                clg('send a message',message.value);
                send({
                    // @ts-ignore
                    content: message.value,
                    type: 'message'
                });

                message.value = '';
            } else {
                clg('message input is empty');
                return
            }
        })
    });
    
    socket.addEventListener('close', (e) => {
        clg('[Socket] closed',e.wasClean,e.code,e.reason);
    });
    
    socket.addEventListener('message', (e) => {
        clg('[Socket] data received', e);
    });
    
    socket.addEventListener('error', (e) => {
        clg('[Socket] error', e);
    }); 

    function requestHistory (contentFromN: number) {
        clg('[Socket] requested chat history');

        send({
            content: contentFromN.toString(),
            type: 'get old',
        });
    }
    function send (obj: Record<string, any>) {
        clg('[Socket] sent data');

        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        const stringified = JSON.stringify(obj);
        socket.send(stringified);
    }
}

import { getChatToken } from 'services/service';
// import { clg } from 'main';

interface SocketParams {
    userId: number;
    chatId: number;
}

export default class ChatConnection {
    private socket: WebSocket | null = null;
    private pingInterval: any = null;
    private reconnectTimeout: any = null;

    private readonly userId: number;
    private readonly chatId: number;

    private isManualClose = false;
    private url = '';

    private onMessageHandler: (data: any) => void;

    constructor(params: SocketParams, onMessage: (data: any) => void) {
        if (window.__socket) window.__socket.close();
        
        this.userId = params.userId;
        this.chatId = params.chatId;
        this.onMessageHandler = onMessage;

        this.connect();
    }
    private async connect() {
        // @ts-ignore
        const { token } = await getChatToken(this.chatId);
        this.url = `wss://ya-praktikum.tech/ws/chats/${this.userId}/${this.chatId}/${token}`;
        this.socket = new WebSocket(this.url);
        window.__socket = this.socket;

        this.socket.addEventListener('open', () => this.onOpen());
        this.socket.addEventListener('message', (e) => this.onMessage(e));
        this.socket.addEventListener('error', (e) => this.onError(e));
        this.socket.addEventListener('close', (e) => this.onClose(e));
    }

    private onOpen() {
        // clg('[WS] Opened');

        this.requestHistory(0);
        this.requestHistory(20);

        this.pingInterval = setInterval(() => {
            this.send({ type: 'ping' });
        }, 10000);
    }

    private onMessage(e: MessageEvent) {
        if (Array.isArray(e.data) && e.data.length === 0) {
            return
        } else {
            try {
                const data = JSON.parse(e.data);
                this.onMessageHandler(data);
            } catch {
                this.onMessageHandler(e.data);
            }
        }
    }

    private onError(e: Event) {
        console.error('[WS] Error:', e);
    }

    private onClose(e: CloseEvent) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;

        if (!this.isManualClose) {
            // clg('[WS] Unexpected close', e.code);
            this.reconnect();
        }
    }
    private reconnect() {
        clearTimeout(this.reconnectTimeout);

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, 2000);
    }
    private send(obj: Record<string, any>) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }

        this.socket.send(JSON.stringify(obj));
    }
    public sendMessage(text: string) {
        this.send({
            type: 'message',
            content: text,
        });
    }
    public requestHistory(from: number) {
        this.send({
            content: from.toString(),
            type: 'get old',
        });
    }
    public close() {
        this.isManualClose = true;
        clearInterval(this.pingInterval);

        if (this.socket) {
            this.socket.close();
        }
    }
}

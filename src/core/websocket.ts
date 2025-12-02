import { getChatToken } from 'services/service';

interface SocketParams {
    userId: number;
    chatId: number;
}
interface TMes {
    content: string
    id: number
    time: string
    type: string
    user_id: number
}

export default class ChatConnection {
    private socket: WebSocket | null = null;
    private pingInterval: number = 0;
    private reconnectTimeout: number = 0;

    private readonly userId: number;
    private readonly chatId: number;

    private isManualClose = false;
    private url = '';

    private onMessageHandler: (data: TMes) => void;

    constructor(params: SocketParams, onMessage: (data: TMes) => void) {
        if (window.__socket) window.__socket.close();
        
        this.userId = params.userId;
        this.chatId = params.chatId;
        this.onMessageHandler = onMessage;

        this.connect();
    }
    private async connect() {
        const result = await getChatToken(this.chatId);

        if (!result || !('token' in result)) {
            throw new Error(`Failed to get chat token: ${JSON.stringify(result)}`);
        }

        const token = result.token;

        this.url = `wss://ya-praktikum.tech/ws/chats/${this.userId}/${this.chatId}/${token}`;
        this.socket = new WebSocket(this.url);
        window.__socket = this.socket;

        this.socket.addEventListener('open', () => this.onOpen());
        this.socket.addEventListener('message', (e) => this.onMessage(e));
        this.socket.addEventListener('error', (e) => this.onError(e));
        this.socket.addEventListener('close', () => this.onClose());
    }

    private onOpen() {
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

    private onClose() {
        clearInterval(this.pingInterval);
        this.pingInterval = 0;

        if (!this.isManualClose) {
            this.reconnect();
        }
    }
    private reconnect() {
        clearTimeout(this.reconnectTimeout);

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, 2000);
    }
    private send(obj: Record<string, unknown>) {
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

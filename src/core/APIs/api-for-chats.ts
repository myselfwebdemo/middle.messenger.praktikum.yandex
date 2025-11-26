import endPointAPI from "./api";

interface TReqError {
    reason: string
}
interface TCNew {
    title: string
}
interface TCDel {
    id: string
}
interface TNewUser {
    users: Array<number>
    chatId: number
}

const xhrChats = new endPointAPI('chats');

export default class ChatRequests {
    private static _instance: ChatRequests;

    constructor() {
        if (ChatRequests._instance) {
            return ChatRequests._instance
        }

        ChatRequests._instance = this;
    }

    async get(): Promise<void | TReqError> {
        return xhrChats.get('/');
    }
    async getUsers(id: number): Promise<void | TReqError> {
        return xhrChats.get(`/${id}/users`);
    }
    async new(data: TCNew): Promise<void | TReqError> {
        return xhrChats.post('/', {data});
    }
    async del(data: TCDel): Promise<void | TReqError> {
        return xhrChats.delete('/', {data});
    }
    async addUser(data: TNewUser): Promise<void | TReqError> {
        return xhrChats.put('/users', {data});
    }
    async token(chatId: number): Promise<void | TReqError> {
        return xhrChats.post(`/token/${chatId}`);
    }
}

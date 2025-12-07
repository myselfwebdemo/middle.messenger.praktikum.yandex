import endPointAPI from './api.ts';

export interface TCNew {
    title: string
}
export interface TCDel {
    chatId: number
}
export interface TNewUser {
    users: Array<number>
    chatId: number
}


export default class ChatRequests {
    private readonly xhrChats = new endPointAPI('chats');
    private static _instance: ChatRequests;

    constructor() {
        if (ChatRequests._instance) {
            return ChatRequests._instance
        }

        ChatRequests._instance = this;
    }

    async get(): Promise<void | TReqError> {
        return this.xhrChats.get('/');
    }
    async getUsers(id: number): Promise<void | TReqError> {
        return this.xhrChats.get(`/${id}/users`);
    }
    async new(data: TCNew): Promise<void | TReqError> {
        return this.xhrChats.post('/', {data});
    }
    async del(data: TCDel): Promise<void | TReqError> {
        return this.xhrChats.delete('/', {data});
    }
    async addUser(data: TNewUser): Promise<void | TReqError> {
        return this.xhrChats.put('/users', {data});
    }
    async delUser(data: TNewUser): Promise<void | TReqError> {
        return this.xhrChats.delete('/users', {data});
    }
    async token(chatId: number): Promise<void | TReqError> {
        return this.xhrChats.post(`/token/${chatId}`);
    }
}

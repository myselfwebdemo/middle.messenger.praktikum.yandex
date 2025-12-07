import endPointAPI from './api.ts';

export interface TPass {
    oldPassword: string
    newPassword: string
}


export default class UserProfileRequests {
    private readonly xhrUser = new endPointAPI('user');
    private static _instance: UserProfileRequests;

    constructor() {
        if (UserProfileRequests._instance) {
            return UserProfileRequests._instance
        }

        UserProfileRequests._instance = this;
    }

    async changeUserData(data: Omit<TUser,'avatar'|'id'>): Promise<void | TReqError> {
        return this.xhrUser.put('/profile', { data });
    }
    async changePass(data: TPass): Promise<void | TReqError> {
        return this.xhrUser.put('/password', { data });
    }
    async newAvatar(data: FormData): Promise<void | TReqError> {
        return this.xhrUser.put('/profile/avatar', { data });
    }
    async search(data: Record<'login',string>): Promise<void | TReqError> {
        return this.xhrUser.post('/search', { data });
    }
}

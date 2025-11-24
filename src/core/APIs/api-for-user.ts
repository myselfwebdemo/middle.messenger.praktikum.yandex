import endPointAPI from "./api";

interface TReqError {
    reason: string
}
interface TUser {
    login: string
    first_name: string
    second_name: string
    display_name: string
    avatar: string
    phone: string
    email: string
}
interface TPass {
    oldPassword: string
    newPassword: string
}

const xhrUser = new endPointAPI('user');

export default class UserProfileRequests {
    private static _instance: UserProfileRequests;

    constructor() {
        if (UserProfileRequests._instance) {
            return UserProfileRequests._instance
        }

        UserProfileRequests._instance = this;
    }

    async changeUserData(data: TUser): Promise<void | TReqError> {
        return xhrUser.put('/profile', { data });
    }
    async changePass(data: TPass): Promise<void | TReqError> {
        return xhrUser.put('/password', { data });
    }
    async newAvatar(data: Record<string, any>): Promise<void | TReqError> {
        return xhrUser.put('/profile/avatar', { data });
    }
    async search(data: Record<'login', string>): Promise<void | TReqError> {
        return xhrUser.post('/search', { data });
    }
}

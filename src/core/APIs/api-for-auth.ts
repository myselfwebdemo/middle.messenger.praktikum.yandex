import endPointAPI from './api.ts';

interface TReqError {
    reason: string
}
interface TSignupRes {
    id: number
}

export interface TLogin {
    login: string
    password: string
}

export default class AuthRequests {
    private readonly xhrAuth = new endPointAPI('auth');
    private static _instance: AuthRequests;

    constructor() {
        if (AuthRequests._instance) {
            return AuthRequests._instance
        }

        AuthRequests._instance = this;
    }

    async bindUser(data: TSignup): Promise<TSignupRes> {
        return this.xhrAuth.post<TSignupRes>("/signup", { data });
    }
    async validate(data: TLogin): Promise<void> {
        return this.xhrAuth.post("/signin", { data })
    }    
    async self(): Promise<TUser | TReqError> {
        return this.xhrAuth.get("/user");
    }
    async withdraw(): Promise<void | TReqError> {
        return this.xhrAuth.post("/logout");
    }
}

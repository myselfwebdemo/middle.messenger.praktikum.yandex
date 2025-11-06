import { clg } from "main";
import transport from "./api";

interface TReqError {
    reason: string;
}
interface TSignupRes {
    id: number
}
interface TUser {
    id: number;
    login: string;
    first_name: string;
    second_name: string;
    display_name: string;
    avatar: string;
    phone: string;
    email: string;
}
type TSignup = Omit<TUser, 'avatar' | 'display_name' | 'id'>  & {
    password: string
}
interface TLogin {
    login: string,
    password: string
}
// interface TLastMessage {
//     user: TUser,
//     time: string,
//     content: string
// }
// interface TChat {
//     id: number,
//     title: string,
//     avatar: string | null,
//     unread_count: number,
//     last_message: TLastMessage | null
// }

const xhrAuth = new transport('auth');

export default class AuthRequests {
    private static _instance: AuthRequests;

    constructor() {
        if (AuthRequests._instance) {
            return AuthRequests._instance
        }

        AuthRequests._instance = this;
    }

    async bindUser(data: TSignup): Promise<TSignupRes> {
        clg('Final step before sending data, data: ',data)
        return xhrAuth.post<TSignupRes>("/signup", { data });
    }
    async validate(data: TLogin): Promise<void> {
        clg('Final step before sending data, data: ',data)
        return xhrAuth.post("/signin", { data });
    }    
    async self(): Promise<TUser | TReqError> {
        return xhrAuth.get("/user");
    }
    async withdraw(): Promise<void | TReqError> {
        return xhrAuth.post("/logout");
    }
}
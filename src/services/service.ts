import AuthRequests from "core/APIs/api-for-auth";
import ChatRequests from "core/APIs/api-for-chats";
import UserProfileRequests from "core/APIs/api-for-user";
import { Routes } from "main";

const requests = new AuthRequests();
const profileRequests = new UserProfileRequests();
const chatsRequests = new ChatRequests();

interface TUser {
    avatar: string
    first_name: string
    second_name: string
    display_name: string
    login: string
    email: string
    phone: string,
}
type TUOnGet = Omit<TUser, 'email'> & {
    id: number
};
type TSignup = Omit<TUser, 'avatar' | 'display_name' | 'id'>  & {
    password: string
}
interface TLogin {
    login: string
    password: string
}
interface TE {
    reason: string
}
interface TL {
    login: string
}
interface TChat {
    avatar: string | null
    created_by: number
    id: number
    last_message: string | null
    title: string
    unread_count: number
}

export const signup = async (data: TSignup) => {
    let err;
    window.memory.give({loading: true, eAPI: null});

    try {
        await requests.bindUser(data).then((res) => {
            if (res.id) {
                const newUser = { ...data, id: res.id };
                window.memory.give({ user: newUser });
            }
        });

        window.router.go(Routes.App);
    } catch (e: TE | any) {
        if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
            err = null;
        } else if (e.response?.reason) {
            err = e.response?.reason;
        } else {
            err = 'Unknown error';
        }
    } finally {
        window.memory.give({loading: false, eAPI: err});
        err=null;
    }
}

export const login = async (data: TLogin) => {
    let err;
    window.memory.give({loading: true, eAPI: null});

    try {
        await requests.validate(data)
        self();

        window.router.go(Routes.App);
    } catch (e: TE | any) {
        if (e.response?.reason) {
            if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
                err = null;
            } else {
                err = e.response?.reason;
            }
        } else {
            err = 'Unknown error';
        }
    } finally {
        window.memory.give({loading: false, eAPI: err});
        err=null;
    }
}

export const searchUser = async (data: TL) => {
    let err;

    try {
        await profileRequests.search(data).then(res => {
            window.memory.give({ search: res });
        });
    } catch (e: TE | any) {
        if (e.response?.reason) {
            if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
                err = null;
            } else {
                err = e.response?.reason;
            }
        } else {
            err = 'Unknown error';
        }
        window.memory.give({eAPI: err});
    } finally {
        err=null;
    }
}

export const editUser = async <T extends Omit<TUser, 'avatar'>>(data: T) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});

    try {
        await profileRequests.changeUserData(data);
        await self();
    } catch (e: TE | any) {
        if (e.response?.reason) {
            if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
                err = null;
            } else {
                err = e.response?.reason;
            }
        } else {
            err = 'Unknown error';
        }
    } finally {
        if (!err) suc=true;
        window.memory.give({loading: false, eAPI: err, sAPI: suc});
        err=null;
        suc=false;
    }
}

export const editPass = async (data:{oldPassword:string,newPassword:string}) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});

    try {
        await profileRequests.changePass(data);
    } catch (e: TE | any) {
        if (e.response?.reason) {
            if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
                err = null;
            } else {
                err = e.response?.reason;
            }
        } else {
            err = 'Unknown error';
        }
    } finally {
        if (!err) suc=true;
        window.memory.give({loading: false, eAPI: err, sAPI: suc});
        err=null;
        suc=false;
    }
}

export const changeAvatar = async (data:FormData) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});
    
    try {
        await profileRequests.newAvatar(data);
        await self();
    } catch (e: TE | any) {
        if (e.response?.reason) {
            if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
                err = null;
            } else {
                err = e.response?.reason;
            }
        } else {
            err = 'Unknown error';
        }
    } finally {
        if (!err) suc=true;
        window.memory.give({loading: false, eAPI: err, sAPI: suc});
        err=null;
        suc=false;
    }
}

export const newChat = async (data:{title:string}) => {
    try {
        let id;
        await chatsRequests.new(data).then(res => {
            id = res;
        });
        return (id as unknown as Record<string, number>).id;
    } catch (e: TE | any) {
        return e
    }
}

export const delChat = async (data:{chatId:number}) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});
    
    try {
        await chatsRequests.del(data);
    } catch (e: TE | any) {
        if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
            err = null;
        } else if (e.response?.reason) {
            err = e.response?.reason;
        } else {
            err = 'Unknown error';
        }
    } finally {
        window.memory.give({loading: false, eAPI: err, sAPI: suc});
        err=null;
        suc=false;
    }
}

export const addUserToChat = async (data: {users: Array<number>,chatId: number}) => {
    try {
        await chatsRequests.addUser(data);
    } catch (e: TE | any) {
        return e;
    }
}
export const delUserFromChat = async (data: {users: Array<number>,chatId: number}) => {
    try {
        await chatsRequests.delUser(data);
    } catch (e: TE | any) {
        return e;
    }
}

export const getChatToken = async (chatId: number) => {
    let token;

    try {
        const t = await chatsRequests.token(chatId);
        token=t;
    } catch (e: TE | any) {
        token=null;
    } finally {
        return token;
    }
}



export const self = async () => {
    let err;
    window.memory.give({loading: true, eAPI: null});

    try {
        await requests.self().then(res => {
            window.memory.give({ user: res });
        });

        await chatsRequests.get().then(async (chats) => {
            let chats_temp: Record<number, {chat: TChat, users: Record<number, TUOnGet>}> = {};

            const promises = (chats as unknown as TChat[]).map(chat => 
                chatsRequests.getUsers(chat.id).then(chat_users => {
                    let singleChat = {
                        chat,
                        users: {} as Record<number, TUOnGet>
                    };
                    (chat_users as unknown as TUOnGet[]).forEach(user => {
                        singleChat.users[user.id] = user;
                    });
                    chats_temp[chat.id] = singleChat;
                })
            );

            await Promise.all(promises);

            window.memory.give({chats: chats_temp});

            // THIS CODE DELETES ALL CHATS, USE ONLY ON DEV STAGE !!!!!
            // chats.forEach(async (chat) => {
            //     await delChat({chatId: chat.id});
            // })
        });
        
        if (window.location.pathname !== Routes.App && window.location.pathname !== '/settings') {
            window.router.go(Routes.App);
        }
    } catch (e: TE | any) {
        if (e.response?.reason) {
            if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
                err = null;
            } else {
                err = e.response?.reason;
            }
        } else {
            err = 'Unknown error';
        }

        const est = e.status;

        if (est === 401) {
            if (window.location.pathname !== '/' && window.location.pathname !== '/sign-up') {
                window.router.go(Routes.Landing);
            }
        } else if (est === 404) {
            window.router.go(Routes.E404);
        } else if (est === 500) {
            window.router.go(Routes.E500);
        }
    } finally {
        window.memory.give({loading: false, eAPI: err});
        err=null;
    }
}

export const chatsUpdate = async () => {
    try {
        await chatsRequests.get().then(async chats => {
            const memChats = window.memory.take().chats;

            let mcID: Number[] = [];
            let fetcID: Number[] = [];

            Object.keys(memChats).forEach(cID => {
                mcID.push(Number(cID));
                mcID.sort();
            });
            (chats as unknown as Array<TChat>).forEach(chat => {
                fetcID.push(chat.id);
                fetcID.sort();
            });

            if (fetcID.toString() !== mcID.toString()) {
                let chats_temp: Record<number, {chat: TChat,users: Record<number, TUOnGet>;}> = {};
    
                const promises = (chats as unknown as Array<TChat>).map(chat => chatsRequests.getUsers(chat.id)
                    .then(chat_users => {
                        let singleChat = {
                            'chat': chat,
                            'users': <Array<TUOnGet>>[]
                        };

                        (chat_users as unknown as Array<TUOnGet>).forEach(user => {
                            singleChat['users'][user.id] = user;
                        })
    
                        chats_temp[chat.id] = singleChat;
                    })
                );
                
                await Promise.all(promises);
    
                window.memory.give({chats: chats_temp});
            } else {
                return
            }
        });
    } catch (e: TE | any) {
        return
    }
}

export const checkLogin = async () => {
    window.memory.give({loading: true, eAPI: null});

    try {
        await self();
    } catch (e: TE | any) {
        return
    } finally {
        window.memory.give({loading: false});
    }
}

export const logout = async () => {
    let err;
    window.memory.give({loading: true, eAPI: null});
    
    try {
        await requests.withdraw();
        
        window.router.go(Routes.Landing);
    } catch (e: TE | any) {
        if (e.response?.reason) {
            if (e.response?.reason.toLowerCase() === 'cookie is not valid') {
                err = null;
            } else {
                err = e.response?.reason;
            }
        } else {
            err = 'Unknown error';
        }
    } finally {
        window.memory.give({loading: false, eAPI: err});
        err=null;
    }
}

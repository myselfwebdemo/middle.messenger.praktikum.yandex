// @ts-nocheck
import endPointAPI from "core/APIs/api";
import AuthRequests from "core/APIs/api-for-auth";
import ChatRequests from "core/APIs/api-for-chats";
import UserProfileRequests from "core/APIs/api-for-user";
import { clg } from "main";

const requests = new AuthRequests();
const profileRequests = new UserProfileRequests();
const chatsRequests = new ChatRequests();

export const signup = async (data) => {
    let err;
    window.memory.give({loading: true, eAPI: null});

    try {
        await requests.bindUser(data).then((res) => {
            if (res.id) {
                const newUser = { ...data, id: res.id };
                window.memory.give({ user: newUser });
            }
        });

        window.router.go('/messenger');
    } catch (e) {
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

export const login = async (data) => {
    let err;
    window.memory.give({loading: true, eAPI: null});

    try {
        await requests.validate(data)
        self();

        window.router.go('/messenger');
    } catch (e) {
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

export const searchUser = async (data) => {
    let err;

    try {
        await profileRequests.search(data).then(res => {
            window.memory.give({ search: res });
        });
    } catch (e) {
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

export const editUser = async (data) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});

    try {
        await profileRequests.changeUserData(data);
        await self();
    } catch (e) {
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

export const editPass = async (data) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});

    try {
        await profileRequests.changePass(data);
    } catch (e) {
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

export const changeAvatar= async (data) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});
    
    try {
        await profileRequests.newAvatar(data);
        await self();
    } catch (e) {
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

export const newChat = async (data) => {
    try {
        let id;
        await chatsRequests.new(data).then(res => {
            id = res;
        });
        return id.id;
    } catch (e) {
        return e
    }
}

export const delChat = async (data) => {
    let err,suc;
    window.memory.give({loading: true, eAPI: null, sAPI: false});
    
    try {
        await chatsRequests.del(data);
    } catch (e) {
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

export const addUserToChat = async (data) => {
    try {
        await chatsRequests.addUser(data);
    } catch (e) {
        clg(e);
    }
}

export const getChatToken = async (id) => {
    let token;

    try {
        const t = await chatsRequests.token(id);
        token=t;
    } catch (e) {
        clg(e);
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

        await chatsRequests.get().then(async chats => {
            let chats_temp = {};

            const promises = chats.map(chat => chatsRequests.getUsers(chat.id)
                .then(chat_users => {
                    let singleChat = {
                        'chat': chat,
                        'users': []
                    }
                    chat_users.forEach(user => {
                        singleChat['users'][user.id] = user;
                    })

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
        
        if (window.location.pathname !== '/messnger' && window.location.pathname !== '/settings') {
            window.router.go('/messenger');
        }
    } catch (e) {
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
            window.router.go('/login');
        } else if (est === 404) {
            window.router.go('/404');
        } else if (est === 500) {
            window.router.go('/500');
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

            let mcID = [];
            let fetcID = [];

            Object.keys(memChats).forEach(cID => {
                mcID.push(Number(cID));
                mcID.sort();
            });
            chats.forEach(chat => {
                fetcID.push(chat.id);
                fetcID.sort();
            });

            if (fetcID.toString() !== mcID.toString()) {
                let chats_temp = {};
    
                const promises = chats.map(chat => chatsRequests.getUsers(chat.id)
                    .then(chat_users => {
                        let singleChat = {
                            'chat': chat,
                            'users': []
                        }
                        chat_users.forEach(user => {
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
    } catch (e) {
        return
    }
}

export const checkLogin = async () => {
    window.memory.give({loading: true, eAPI: null});

    try {
        await self();
    } catch (e) {
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
        
        window.router.go('/login');
    } catch (e) {
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

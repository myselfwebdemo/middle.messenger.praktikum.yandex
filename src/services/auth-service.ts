// @ts-nocheck
import AuthRequests from "core/APIs/api-for-auth";
import { clg } from "main";

const requests = new AuthRequests();

export const login = async (data) => {
    window.storage.give({loading: true});

    try {
        await requests.validate(data)
                
        // await requests.self();

        window.router.go('/messenger');
    } catch (e) {
        clg(e);
        // window.storage.give({eApi: e.reason});
    } finally {
        window.storage.give({loading: false});
    }
}

export const logout = async () => {
    window.storage.give({loading: true});
    
    try {
        await requests.withdraw();
        window.router.go('/');
    } catch (e) {
        clg(e);
        // window.storage.give({eApi: e.reason});
    } finally {
        window.storage.give({loading: false});
    }
}

// export const checkLogin = async () => {
//     window.storage.give({loading: true});

//     try {
//         const user = await requests.self();
//         window.router.go('/messenger');
//         window.storage.give({user});
//     } catch (error) {
//         // const e = await error.json();
//         // window.storage.give({eApi: e.reason});
//     } finally {
//         window.storage.give({loading: false});
//     }
// }


import { SERVER_BASE_URL } from "../../config";
import type { TCDel, TCNew, TNewUser } from "./api-for-chats";
import type { TPass } from "./api-for-user";

enum METHOD {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

interface RequestType {
    method: METHOD,
    data?: TCNew | TCDel | TNewUser | TPass | FormData | Record<'login',string>
}

type RequestWithoutMethod = Omit<RequestType, 'method'>;

export default class endPointAPI {
    private baseURL: string = SERVER_BASE_URL;

    constructor(path: string) {
        this.baseURL += path;
    }

    get<TResponse>(url: string, inRequestData: RequestWithoutMethod = {}): Promise<TResponse> {
        return this.request<TResponse>(`${this.baseURL}${url}`, { ...inRequestData, method: METHOD.GET });
    }
    
    post<TResponse>(url: string, inRequestData: RequestWithoutMethod = {}): Promise<TResponse> {
        return this.request<TResponse>(`${this.baseURL}${url}`, { ...inRequestData, method: METHOD.POST });
    }
    
    put<TResponse>(url: string, inRequestData: RequestWithoutMethod = {}): Promise<TResponse> {
        return this.request<TResponse>(`${this.baseURL}${url}`, { ...inRequestData, method: METHOD.PUT });
    }

    delete<TResponse>(url: string, inRequestData: RequestWithoutMethod = {}): Promise<TResponse> {
        return this.request<TResponse>(`${this.baseURL}${url}`, { ...inRequestData, method: METHOD.DELETE });
    }

    async request<TResponse> (
        url: string,
        req: RequestType = {method: METHOD.GET},
    ): Promise<TResponse> {
        const { method, data } = req;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open(method, url);
            xhr.withCredentials = true;
            xhr.responseType = "json";
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status <= 300) {
                    resolve(xhr.response as TResponse);
                } else {
                    reject(xhr);
                }
            };
            
            xhr.onerror = () => reject();
            
            if (data instanceof FormData) {
                xhr.send(data)
            } else if (data) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        });
    }
}

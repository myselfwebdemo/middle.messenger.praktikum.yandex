import { clg } from "main";

enum METHOD {
    GET = "GET",
    POST = "POST",

    // other methods (UNREALIZED)
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

interface RequestType {
    method: METHOD,
    data?: Record<string, any>
}

type RequestWithoutMethod = Omit<RequestType, 'method'>;

export default class transport {
    private baseURL: string = '';

    constructor(path: string) {
        this.baseURL = `/api/${path}`;
        // this.baseURL = `https://ya-praktikum.tech/api/v2/${path}`;
    }

    get<TResponse>(url: string, inRequestData: RequestWithoutMethod = {}): Promise<TResponse> {
        return this.request<TResponse>(`${this.baseURL}${url}`, { 
            ...inRequestData,
            method: METHOD.GET
        });
    }
    
    post<TResponse>(url: string, inRequestData: RequestWithoutMethod = {}): Promise<TResponse> {
        return this.request<TResponse>(`${this.baseURL}${url}`, { ...inRequestData, method: METHOD.POST });
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
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status <= 300) {
                    resolve(xhr.response as TResponse);
                } else {
                    reject(xhr);
                }
            };

            xhr.onloadend = () => {
                if (xhr.status === 200) {
                    clg("Supposed success", xhr.status, "Response body:", xhr.response);
                } else {
                    clg("Failed", xhr.status, xhr?.response?.reason);
                }
            };
            xhr.onerror = () => reject();

            if (!data) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(data));
            }
        });
    }
}

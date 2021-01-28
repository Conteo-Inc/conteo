declare type HttpResponse<T> = Response & {
    parsedBody?: T;
};
export declare function http<T>(request: RequestInfo): Promise<HttpResponse<T>>;
export declare function request<T>(path: string, method: 'get' | 'put' | 'post', includeAuth?: boolean, specifyJson?: boolean, body?: any): Promise<HttpResponse<T>>;
export {};

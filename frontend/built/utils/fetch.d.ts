declare type HttpResponse<T> = Response & {
    parsedBody?: T;
};
export declare function http<T>(request: RequestInfo): Promise<HttpResponse<T>>;
export declare function get<T>(path: string, args?: RequestInit): Promise<HttpResponse<T>>;
export declare function post<T>(path: string, body: any, args?: RequestInit): Promise<HttpResponse<T>>;
export declare function put<T>(path: string, body: any, args?: RequestInit): Promise<HttpResponse<T>>;
export {};

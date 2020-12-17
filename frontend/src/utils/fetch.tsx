type HttpResponse<T> = Response & {
    parsedBody?: T;
};

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
    const res: HttpResponse<T> = await fetch(request);

    try {
        res.parsedBody = await res.json();
    } catch (ex) {}

    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res;
}

export async function get<T>(
    path: string,
    args: RequestInit = { method: 'get' }
): Promise<HttpResponse<T>> {
    return await http<T>(new Request(path, args));
}

export async function post<T>(
    path: string,
    body: any,
    args: RequestInit = { method: 'post', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
    return await http<T>(new Request(path, args));
}

export async function put<T>(
    path: string,
    body: any,
    args: RequestInit = { method: 'put', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
    return await http<T>(new Request(path, args));
}

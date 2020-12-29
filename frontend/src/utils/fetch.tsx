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

/*
path: some api endpoint string, e.g. '/api/current-user/'
method: fetch method
includeAuth: if true, the request header will include the jwt authorization
specifyJson: if true, the request header will include the Content-Type header with the value 'application/json'
*/
export async function request<T>(
    path: string,
    method: 'get' | 'put' | 'post',
    includeAuth: boolean = true,
    specifyJson: boolean = true,
    body?: any
) {
    const args: RequestInit = {
        method: method,
        headers: {
            //The ...(<boolean> && obj) syntax will spread the obj if the boolean is true,
            //otherwise it will exclude

            //conditionally adds the Authorization property
            ...(includeAuth && {
                Authorization: `JWT ${localStorage.getItem('token')}`,
            }),
            //conditionally adds the Content-Type property
            ...(specifyJson && { 'Content-Type': 'application/json' }),
        },
        //conditionally adds the body
        ...(body && { body: JSON.stringify(body) }),
    };
    return await http<T>(new Request(path, args));
}
import * as Cookies from "js-cookie"

type HttpResponse<T> = Response & {
  parsedBody: T
}

export async function http(request: RequestInfo): Promise<Response> {
  const res: Response = await fetch(request)

  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return res
}

type requestArgs<T> = {
  path: string
  method: "get" | "put" | "post"
  parser?: (res: Response) => Promise<T>
  headers?: RequestInit["headers"] & { "Content-Type": string }
  body?: any // eslint-disable-line
  isFormData?: boolean
}

async function parseAsJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T
}

export async function parseIdentity(res: Response): Promise<Response> {
  return await res
}

const defaultRequestArgs = {
  headers: {
    "Content-Type": "application/json",
  },
  parser: parseAsJson,
}
/**
 * A generic, strongly typed `fetch` wrapper.
 * @param path: The path to the endpoint
 * @param method The request method
 * @param body: The data passed to the request. This is stringified when isFormData is false.
 * @param isFormData: Determines if the request is form data.
 * @param headers: By default, the headers includes a Content-Type of "application/json"
 * @param parser: The method by which `res.parsedBody` is generated.
 *    By default, the parser converts the response to json.
 */
export async function request<T>({
  path,
  method,
  body,
  headers = defaultRequestArgs.headers,
  parser = defaultRequestArgs.parser,
  isFormData = false,
}: requestArgs<T>): Promise<HttpResponse<T>> {
  const csrfToken = Cookies.get("csrftoken")
  const args: RequestInit = {
    method: method,
    headers: {
      ...(!isFormData && headers),
      //conditionally adds the X-CSRFToken property
      ...(csrfToken && { "X-CSRFToken": csrfToken }),
    },
    //conditionally adds the body
    ...(body && isFormData ? { body: body } : { body: JSON.stringify(body) }),
  }
  const res = await http(new Request(path, args))
  return { ...res, parsedBody: await parser(res) }
}

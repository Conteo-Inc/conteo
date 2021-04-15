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
 * @param body: The data passed to the request. This is always stringifieds
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
}: requestArgs<T>): Promise<HttpResponse<T>> {
  const csrfToken = Cookies.get("csrftoken")
  const args: RequestInit = {
    method: method,
    headers: {
      ...headers,
      //conditionally adds the X-CSRFToken property
      ...(csrfToken && { "X-CSRFToken": csrfToken }),
    },
    //conditionally adds the body
    ...(body && { body: JSON.stringify(body) }),
  }
  const res = await http(new Request(path, args))
  return { ...res, parsedBody: await parser(res) }
}

/**
 * queryParams encodes an object into a string suitable for query parameters
 * in a URI.
 * @param obj object to turn into query parameters for a URI
 * @returns URI-encoded query parameters to be appended to a URI
 * @throws queryParams will throw an error if it can't encode a property
 */
export function queryParams(obj: Record<string, unknown>): string {
  const params: string[] = []
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    switch (typeof val) {
      case "number":
      case "string":
      case "boolean":
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(val))
        break
      case "object":
        if (val instanceof Array) {
          val.forEach((v) => {
            params.push(encodeURIComponent(key) + "=" + encodeURIComponent(v))
          })
        } else {
          throw new Error(`Failed to encode key/value pair: ${key}=${val}`)
        }
        break
      default:
        throw new Error(`Failed to encode key/value pair: ${key}=${val}`)
    }
  }
  return "?" + params.join("&")
}

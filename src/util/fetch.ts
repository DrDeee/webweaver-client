import FormData from "form-data";
import fetch, { Response } from "node-fetch";

let baseUrl: string

export { baseUrl }
export function init(url: string) {
    baseUrl = url
}
export async function get(url: string): Promise<Response> {
    return fetch(baseUrl + url)
}

export function postFormdata(url: string, data: FormData): Promise<Response> {
    return fetch(baseUrl + url, {
        body: data,
        method: 'POST'
    })
}
import { JSDOM } from "jsdom"

export function htmlToDocument(html: string) {
    return (new JSDOM(html)).window.document
}
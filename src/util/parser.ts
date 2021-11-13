import { load, CheerioAPI } from "cheerio"
export function htmlToCheerio(html: string): CheerioAPI {
    return load(html)
}
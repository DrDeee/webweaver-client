import { CheerioAPI } from 'cheerio'
import FormData from 'form-data'
import { URL } from 'url'
import ClassManager from './managers/classes'
import { htmlToCheerio } from "./util/parser"
import * as fetch from './util/fetch'
export default class WebWeaverClient {
    private userName: string
    private ping: any
    private sid: string | null | undefined
    private stopHeartbeat: boolean = false

    public classes: ClassManager = new ClassManager(this)
    logoutHref: string | undefined
    constructor(baseUrl: string, userName: string) {
        fetch.init(baseUrl)
        this.userName = userName

        this.ping = {}
    }
    async login(password: string) {
        const formData = new FormData();
        formData.append("login_nojs", "")
        formData.append("login_login", this.userName)
        formData.append("login_password", password)
        formData.append("language", "2")
        const resp = await fetch.postFormdata("/wws/100001.php", formData);
        const url = new URL(resp.url)
        this.sid = url.searchParams.get('sid')
        console.info('Client logged in.')
        this._heartbeat()
        await this._scan(await resp.text())
    }
    catch(e: any) {
        console.log(e)
    }

    async _heartbeat() {
        if (this.stopHeartbeat) {
            await fetch.get('/wws/' + this.logoutHref as string)
            console.info('Client logged out.')
            return
        }
        const content = await (await fetch.get((this.ping['url'] ? this.ping['url'] : "/wws/999.php?json=1&sid=" + this.sid))).json()

        const url = new URL(fetch.baseUrl + content.next)
        this.sid = url.searchParams.get('sid')

        this.ping['url'] = content.next
        await new Promise((res) => {
            setTimeout(res, 15000)
        })
        this._heartbeat()
    }

    public close() {
        this.stopHeartbeat = true
    }

    async _scan(text: string) {
        const $: CheerioAPI = htmlToCheerio(text)
        this.classes.sync($)

        this.logoutHref = $('#skeleton_main > div.top_outer > div.meta > div.top_login_text > a').attr('href')
    }
}
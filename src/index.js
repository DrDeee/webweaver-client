const FormData = require('form-data')
const fetch = require('node-fetch')
const htmlToDocument = require('./util/parser').htmlToDocument
module.exports = class WebWeaverClient {
    constructor(baseUrl, userName) {
        this.baseUrl = baseUrl
        this.userName = userName

        this.ping = {}
    }
    async login(password) {
        const formData = new FormData();
        formData.append("login_nojs", "")
        formData.append("login_login", this.userName)
        formData.append("login_password", password)
        formData.append("language", "2")
        const resp = await fetch(this.baseUrl + "/wws/100001.php", {
            body: formData,
            method: "POST",
        });
        const url = new URL(resp.url)
        this.sid = url.searchParams.get('sid')
        console.info('Client logged in.')
        this._heartbeat()
        await this._scan(await resp.text())
    }
    catch (e) {
        console.log(e)
    }

    async _heartbeat() {
        const content = await (await fetch(this.baseUrl + (this.ping['url'] ? this.ping['url'] : "/wws/999.php?json=1&sid=" + this.sid), {
            body: null
        })).json()

        const url = new URL(this.baseUrl + content.next)
        this.sid = url.searchParams.get('sid')

        this.ping['url'] = content.next
        await new Promise((res, rej) => {
            setTimeout(res, 15000)
        })
        this._heartbeat()
    }

    async _scan(text) {
        const window = htmlToDocument(text)
        console.log(window.getElementById('main_frame'))
    }
}
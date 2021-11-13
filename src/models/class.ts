import WebWeaverClient from "..";
import Task from "./task";
import { get } from "../util/fetch"
import { htmlToCheerio } from "../util/parser";
import { Teacher } from "./users";
import * as fetch from "../util/fetch"
export default class Class {
    private client: WebWeaverClient

    private page: string | null = null
    private teacher: Teacher | null = null
    private tasks: Task[] = []

    public _href: string
    name: string

    private async loadPage() {
        const response = await get('/wws/' + this._href)
        this.page = await response.text()
    }
    async getTeacher(): Promise<Teacher> {
        if (!this.teacher) {
            if (!this.page) {
                await this.loadPage()
                this.client._scan(this.page as string)
            }
            const $ = htmlToCheerio(this.page as string)
            const elem = $('table.rc_moderator tbody tr td.rc_moderator_td_user span')
            this.teacher = {
                name: $(elem).text(),
                mail: $(elem).attr('title') as string
            }
        }
        return this.teacher
    }
    async getTasks(): Promise<Task[]> {
        if(!this.page) await this.loadPage()
        this.tasks = []
        console.log('/wws/' + htmlToCheerio(this.page as string)('#link_tasks').attr('href') as string)
        const resp = await fetch.get('/wws/' + htmlToCheerio(this.page as string)('#link_tasks').attr('href') as string)
        const $ = htmlToCheerio(await resp.text())
        $('main#main_content div.jail_table table.table_list.space tbody tr').each((_index, element) => {
            this.tasks.push(new Task(this.client, $('td.c_title a', element).text()))
        })
        return this.tasks
    }

    private constructor(client: WebWeaverClient, name: string, href: string) {
        this.client = client

        this.name = name
        this._href = href
    }
    static create(client: WebWeaverClient, name: string, href: string): Class {
        return new Class(client, name, href)
    }
}
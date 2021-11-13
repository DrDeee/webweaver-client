import { CheerioAPI } from "cheerio"
import Class from "../models/class"
import Manager from "./default"

interface ClassData {
    name: string
    href: string
}

export default class ClassManager extends Manager {
    private classes: Class[] = []
    public sync($: CheerioAPI): void {
        const toSync: ClassData[] = []
        $('#top_select_19 optgroup option').each((id, element) => {
            toSync[id] = {
                name: $(element).text(),
                href: $(element).val() as string
            }
        })
        for (const index in toSync) {
            if (this.classes[index] && this.classes[index].name === toSync[index].name)
                this.classes[index]._href = toSync[index].href
            else {
                this.classes[index] = Class.create(this.client, toSync[index].name, toSync[index].href)
            }
        }
    }

    public getAll(): Class[] {
        return this.classes
    }

    public get(name: string): Class | null {
        for (const c of this.classes) {
            if (c.name === name)
                return c
        }
        return null
    }
}
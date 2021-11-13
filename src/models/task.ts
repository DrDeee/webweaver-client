import WebWeaverClient from ".."

export default class Task {
    private client: WebWeaverClient

    public title: string

    public constructor(client: WebWeaverClient, title: string){
        this.title = title

        this.client = client
        this.client
    }

    /* async getCreator(): Promise<string

    async getSource(): Promise<string> {
        throw "Not Implemented"
    }

    async getCreatedAt(): Promise<string> {
        throw "Not Implemented"
    } */

    async getContent(): Promise<string> {
        throw "Not Implemented"
    }
}
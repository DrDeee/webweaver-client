import WebWeaverClient from "..";

export default class Manager {
    protected client: WebWeaverClient
    public constructor(client: WebWeaverClient){
        this.client = client
    }
}
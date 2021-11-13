import Client from '../src'
import {config} from 'dotenv'

config()

const client = new Client(process.env.BASEURL as string, process.env.USER as string)

client.login(process.env.PASSWORD as string).then(async () => {
    client.close()
})
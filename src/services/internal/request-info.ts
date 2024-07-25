import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import fs from 'fs/promises'
import config from '@/env'

const requestInfo: Executor = async (client, message) => {
    let request = message.body.split(' ').slice(1).join(' ')

    if (request == '') {
        wweb.replyMessage(message, 'Request/sarannya apa nih 😥?')
        return 0
    }

    const contact = await message.getContact()
    request = request + ' | oleh ' + (contact?.pushname ?? 'Tanpa Nama')
    await recordRequest(request)
    wweb.replyMessage(message, 'Terimakasih atas saran yang diberikan! 😁')

    if (config.whatsappChatId) client.sendMessage(config.whatsappChatId, request)
}

const recordRequest = async (text: string) => {
    fs.readFile('assets/feature-request.json', 'utf-8')
        .then(data => {
            const records = JSON.parse(data)
            records.push(text)
            fs.writeFile('assets/feature-request.json', JSON.stringify(records), 'utf-8')
        })
}

export {
    requestInfo
}
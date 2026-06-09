import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import fs from 'fs/promises'
import config from '@/env'

const MAX_REQUEST_LENGTH = 500;

/**
 * Sanitize user input to prevent injection in stored records
 * and forwarded WhatsApp messages
 */
const sanitizeInput = (text: string): string => {
    // Strip newlines and control characters that could break JSON or inject content
    return text
        .replace(/[\r\n\t]/g, ' ')
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/\|/g, '/') // replace pipe to avoid spoofing the "oleh" separator
        .trim()
        .slice(0, MAX_REQUEST_LENGTH);
};

const requestInfo: Executor = async (client, message) => {
    let request = message.body.split(' ').slice(1).join(' ')

    if (request == '') {
        wweb.replyMessage(message, 'Request/sarannya apa nih 😥?')
        return 0
    }

    const contact = await message.getContact()
    const sanitizedRequest = sanitizeInput(request);
    const sanitizedName = sanitizeInput(contact?.pushname ?? 'Tanpa Nama');
    const recordText = sanitizedRequest + ' | oleh ' + sanitizedName;
    await recordRequest(recordText)
    wweb.replyMessage(message, 'Terimakasih atas saran yang diberikan! 😁')

    if (config.whatsappChatId) {
        client.sendMessage(config.whatsappChatId, `${config.ownerName}, baru saja ada yang melakukan request fitur:`)
        client.sendMessage(config.whatsappChatId, recordText)
    }
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
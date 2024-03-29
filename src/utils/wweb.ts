import { Client, Message, MessageContent, MessageSendOptions } from 'whatsapp-web.js'
import system from '@/env'

type SendingOptions = MessageSendOptions | undefined;

const mediaStickerMetadata = (stickerCreatorName: string | null = null): object => {
    let metadata: object = {
        sendMediaAsSticker: true,
        stickerName: system.botCodeName
    }

    if (stickerCreatorName) {
        metadata = {
            ...metadata,
            stickerAuthor: 'Made by ' + stickerCreatorName
        }
    } else {
        metadata = {
            ...metadata,
            stickerAuthor: `Made by ${system.botName}`
        }
    }

    return metadata
}

/**
 * Sends the message based from `from` / chatId, referred to environment.
 * @param {Client} client `Client` instance from wweb.js
 * @param {string} from chatId, it may be retrieved from `Message.from`
 * @param {MessageContent} message The message, though it `string`, or `MessageContent`
 * @param {SendingOptions} options sending options, if available.
 */
const sendMessage = (client: Client, from: string, message: MessageContent, options: SendingOptions = undefined) => {
    if(!system.isSendingMessageEnabled) {
        return 0
    }

    client.sendMessage(from, message, options);
}

/**
 * Sends a reply message, referred to environment.
 *
 * @param {Message} message - the message to reply to
 * @param {MessageContent} content - the content of the reply message
 * @param {SendingOptions} options - (optional) additional options for sending the reply
 */
const replyMessage = (message: Message, content: MessageContent, options: SendingOptions = undefined) => {
    if(!system.isSendingMessageEnabled) {
        return 0
    }

    message.reply(content, undefined, options);
}

export {
    mediaStickerMetadata,
    sendMessage,
    replyMessage
}
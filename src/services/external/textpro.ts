import { Client, Contact, Message, MessageMedia } from 'whatsapp-web.js'
import { AxiosError } from 'axios'
import axiosInstance from '@utils/axios-instance'
import { warningNoTextMessage, createTextProImage, TextProImageObject } from '@utils/textpro'
import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import * as logger from '@utils/logger'


/**
 * Routes textpro style based on the command.
 * @param {Client} client - The message object
 * @param {Message} message - The message object
 * @return {Promise<void>} The promise of void
 */
const textProSingleTextRouter: Executor = async (client: Client, message: Message): Promise<void> => {
    const command: string = message.body.split(' ')[0];
    let url: string;

    wweb.replyMessage(message, 'Fitur TextPro saat ini sedang ditangguhkan. Maaf 🙏')
    return;

    switch (command) {
        case '.neon':
            url = 'https://textpro.me/neon-light-text-effect-online-882.html';
            break;
        case '.lunar':
            url = 'https://textpro.me/create-online-lunar-new-year-greeting-text-effect-1153.html';
            break;
        case '.thunder':
            url = 'https://textpro.me/create-3d-thunder-text-effects-online-1147.html';
            break;
        case '.shadow':
            url = 'https://textpro.me/create-a-gradient-text-shadow-effect-online-1141.html';
            break;
        case '.snow':
            url = 'https://textpro.me/create-beautiful-3d-snow-text-effect-online-1101.html';
            break;
        case '.winter':
            url = 'https://textpro.me/create-winter-cold-snow-text-effect-online-1100.html';
            break;
        case '.frozen':
            url = 'https://textpro.me/create-realistic-3d-text-effect-frozen-winter-1099.html';
            break;
        case '.artistic-typography':
            url = 'https://textpro.me/create-artistic-typography-online-1086.html';
            break;
        case '.gradient-neon':
            url = 'https://textpro.me/create-gradient-neon-light-text-effect-online-1085.html';
            break;
        case '.blackpink':
            url = 'https://textpro.me/create-neon-light-blackpink-logo-text-effect-online-1081.html';
            break;
        case '.sliced-effect':
            url = 'https://textpro.me/create-light-glow-sliced-text-effect-online-1068.html';
            break;
        case '.red-batman':
            url = 'https://textpro.me/make-a-batman-logo-online-free-1066.html';
            break;
        case '.neon-valentine':
            url = 'https://textpro.me/create-neon-light-on-brick-wall-online-1062.html';
            break;
        case '.neon-cube':
            url = 'https://textpro.me/neon-light-text-effect-with-galaxy-style-981.html';
            break;
        case '.blackpink-logo':
            url = 'https://textpro.me/create-blackpink-logo-style-online-1001.html';
            break;
        default:
            url = 'https://textpro.me';
            break;
    }

    textpro(client, message, url);
}

const textpro = async (client: Client, message: Message, url: string) => {
    try {
        const sender: Contact = await message.getContact();

        // Extract the text, determine if command is want to use sticker
        let text: string | string[] = message.body.split(' ');
        let isSticker: boolean = text.includes('!sticker');

        // Separate command(s) and text
        const command: string = text[0];
        text = text.slice(isSticker ? 2 : 1);

        // If the user only input just command(s) only.
        if (text.length === 0) {
            wweb.replyMessage(message, warningNoTextMessage(command));
            return 0;
        }

        // Join the rest of the text
        text = text.join(' ')

        const image: TextProImageObject = await createTextProImage(text, url, axiosInstance);

        if (isSticker) {
            wweb.replyMessage(
                message,
                new MessageMedia(image.mimetype, image.image),
                wweb.mediaStickerMetadata(sender.pushname)
            )
        } else {
            wweb.replyMessage(message, new MessageMedia(image.mimetype, image.image));
        }

    } catch (error) {
        const contact = await message.getContact();
        const err = error as AxiosError;
        logger.logError('TextPro - ' + err.message + ' by ' + contact?.pushname ?? 'unknown');

        wweb.replyMessage(message, 'Gagal memproses gambar, silahkan coba lagi');
    }
}

export {
    textProSingleTextRouter
}